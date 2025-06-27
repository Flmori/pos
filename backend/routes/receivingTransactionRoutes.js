import express from 'express';
import ReceivingTransaction from '../models/ReceivingTransaction.js';
import ReceivingItem from '../models/ReceivingItem.js';
import Product from '../models/Product.js';
import sequelize from '../config/database.js';

const router = express.Router();

import User from '../models/User.js';

import { Op } from 'sequelize';

// Get all receiving transactions with related data
router.get('/', async (req, res) => {
  try {
    const transactions = await ReceivingTransaction.findAll({
      include: [
        {
          model: User,
          attributes: ['id_user', 'nama_lengkap'],
        },
        {
          model: ReceivingItem,
          include: [
            {
              model: Product,
              attributes: ['id_barang', 'nama_barang'],
            },
          ],
        },
      ],
      order: [['tanggal_penerimaan', 'DESC'], ['nomor_dokumen_penerimaan', 'DESC']],
    });

    // Flatten data to match frontend expected fields
    const result = [];

    transactions.forEach((transaction) => {
      const pegawaiPencatat = transaction.User ? transaction.User.nama_lengkap : '';
      const catatan = transaction.catatan || '';
      const nomorDokumen = transaction.nomor_dokumen_penerimaan || '';
      const tanggalPenerimaan = transaction.tanggal_penerimaan;

      if (transaction.ReceivingItems && transaction.ReceivingItems.length > 0) {
        transaction.ReceivingItems.forEach((item) => {
          result.push({
            tanggal_penerimaan: tanggalPenerimaan,
            nomor_dokumen_penerimaan: nomorDokumen,
            pegawai_pencatat: pegawaiPencatat,
            nama_produk: item.Product ? item.Product.nama_barang : '',
            jumlah_diterima: item.jumlah_diterima,
            kondisi_barang: item.kondisi_barang,
            catatan: catatan,
          });
        });
      } else {
        // If no items, still push transaction with empty item fields
        result.push({
          tanggal_penerimaan: tanggalPenerimaan,
          nomor_dokumen_penerimaan: nomorDokumen,
          pegawai_pencatat: pegawaiPencatat,
          nama_produk: '',
          jumlah_diterima: 0,
          kondisi_barang: '',
          catatan: catatan,
        });
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Error in GET /receiving-transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get receiving transaction by id
router.get('/:id', async (req, res) => {
  try {
    const transaction = await ReceivingTransaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Receiving transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new receiving transaction with items and update stock and price
router.post('/', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nomor_dokumen_penerimaan, tanggal_penerimaan, catatan, id_pegawai_gudang, items } = req.body;
    if (!tanggal_penerimaan || !id_pegawai_gudang) {
      await t.rollback();
      console.error('Missing required fields:', { nomor_dokumen_penerimaan, tanggal_penerimaan, id_pegawai_gudang });
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      await t.rollback();
      console.error('Items array is required and cannot be empty:', items);
      return res.status(400).json({ error: 'Items array is required and cannot be empty' });
    }

    // Create receiving transaction
    const transaction = await ReceivingTransaction.create(
      { nomor_dokumen_penerimaan, tanggal_penerimaan, catatan, id_pegawai_gudang },
      { transaction: t }
    );

    // Save receiving items
    for (const item of items) {
      const { id_barang, jumlah_diterima, kondisi_barang } = item;
      if (!id_barang || !jumlah_diterima || !kondisi_barang) {
        await t.rollback();
        console.error('Missing required fields in items:', item);
        return res.status(400).json({ error: 'Missing required fields in items' });
      }
      await ReceivingItem.create(
        {
          id_penerimaan: transaction.id_penerimaan,
          id_barang,
          jumlah_diterima,
          kondisi_barang,
        },
        { transaction: t }
      );

      // Update product stock if kondisi_barang is 'Baik'
      if (kondisi_barang === 'Baik') {
        const product = await Product.findByPk(id_barang, { transaction: t });
        if (product) {
          product.stok += jumlah_diterima;
          await product.save({ transaction: t });
        }
      }
    }

    await t.commit();
    res.status(201).json(transaction);
  } catch (error) {
    await t.rollback();
    console.error('Error saving receiving transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update receiving transaction
router.put('/:id', async (req, res) => {
  try {
    const transaction = await ReceivingTransaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Receiving transaction not found' });

    const { nomor_dokumen_penerimaan, tanggal_penerimaan, catatan, id_pegawai_gudang } = req.body;
    if (nomor_dokumen_penerimaan) transaction.nomor_dokumen_penerimaan = nomor_dokumen_penerimaan;
    if (tanggal_penerimaan) transaction.tanggal_penerimaan = tanggal_penerimaan;
    if (catatan) transaction.catatan = catatan;
    if (id_pegawai_gudang) transaction.id_pegawai_gudang = id_pegawai_gudang;

    await transaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete receiving transaction
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await ReceivingTransaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Receiving transaction not found' });
    await transaction.destroy();
    res.json({ message: 'Receiving transaction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
