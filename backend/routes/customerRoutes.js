import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    console.error('[Customer GET /] Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get customer by id
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { nama_pelanggan, no_wa, alamat, is_member, tgl_daftar_member, poin_loyalitas } = req.body;
    if (!nama_pelanggan || !no_wa) {
      return res.status(400).json({ error: 'nama_pelanggan and no_wa are required' });
    }
    const customer = await Customer.create({ nama_pelanggan, no_wa, alamat, is_member, tgl_daftar_member, poin_loyalitas });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const { nama_pelanggan, no_wa, alamat, is_member, tgl_daftar_member, poin_loyalitas } = req.body;
    if (nama_pelanggan) customer.nama_pelanggan = nama_pelanggan;
    if (no_wa) customer.no_wa = no_wa;
    if (alamat) customer.alamat = alamat;
    if (is_member !== undefined) customer.is_member = is_member;
    if (tgl_daftar_member) customer.tgl_daftar_member = tgl_daftar_member;
    if (poin_loyalitas !== undefined) customer.poin_loyalitas = poin_loyalitas;

    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    await customer.destroy();
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
