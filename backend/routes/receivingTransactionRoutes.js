import express from 'express';
import ReceivingTransaction from '../models/ReceivingTransaction.js';

const router = express.Router();

// Get all receiving transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await ReceivingTransaction.findAll();
    res.json(transactions);
  } catch (error) {
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

// Create new receiving transaction
router.post('/', async (req, res) => {
  try {
    const { nomor_dokumen_penerimaan, tanggal_penerimaan, catatan, id_pegawai_gudang } = req.body;
    if (!nomor_dokumen_penerimaan || !tanggal_penerimaan || !id_pegawai_gudang) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const transaction = await ReceivingTransaction.create({ nomor_dokumen_penerimaan, tanggal_penerimaan, catatan, id_pegawai_gudang });
    res.status(201).json(transaction);
  } catch (error) {
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
