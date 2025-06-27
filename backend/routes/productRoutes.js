import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { Op } from 'sequelize';

const router = express.Router();

// Get all products with category and optional search filter
router.get('/', async (req, res) => {
  try {
    const search = req.query.search;
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { nama_barang: { [Op.like]: `%${search}%` } },
        { id_barang: { [Op.like]: `%${search}%` } }
      ];
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          attributes: ['nama_kategori'] // Assuming category name field is nama_kategori
        }
      ]
    });
    res.json(products);
  } catch (error) {
    console.error('Product Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// New route for stock report
router.get('/stock-report', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        stok: {
          [Op.lt]: 20
        }
      },
      include: [
        {
          model: Category,
          attributes: ['nama_kategori']
        }
      ],
      order: [['nama_barang', 'ASC']]
    });
    console.log(`Stock report products count: ${products.length}`);
    console.log('Products:', products.map(p => ({ id: p.id_barang, name: p.nama_barang, stock: p.stok })));
    res.json(products);
  } catch (error) {
    console.error('Stock Report Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get product by id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error('Product Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new product
router.post('/', async (req, res) => {
  try {
    const { nama_barang, deskripsi, harga_beli, harga_jual, stok, id_kategori } = req.body;
    if (!nama_barang || harga_beli === undefined || harga_jual === undefined || stok === undefined || !id_kategori) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const product = await Product.create({ nama_barang, deskripsi, harga_beli, harga_jual, stok, id_kategori });
    res.status(201).json(product);
  } catch (error) {
    console.error('Product Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { nama_barang, deskripsi, harga_beli, harga_jual, stok, id_kategori } = req.body;
    if (nama_barang) product.nama_barang = nama_barang;
    if (deskripsi) product.deskripsi = deskripsi;
    if (harga_beli !== undefined) product.harga_beli = harga_beli;
    if (harga_jual !== undefined) product.harga_jual = harga_jual;
    if (stok !== undefined) product.stok = stok;
    if (id_kategori) product.id_kategori = id_kategori;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Product Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Product Route Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
