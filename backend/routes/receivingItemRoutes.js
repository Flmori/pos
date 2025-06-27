import express from 'express';
import ReceivingItem from '../models/ReceivingItem.js';

const router = express.Router();

// Get all receiving items
router.get('/', async (req, res) => {
  try {
    const items = await ReceivingItem.findAll();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get receiving item by composite key (id_penerimaan and id_barang)
router.get('/:id_penerimaan/:id_barang', async (req, res) => {
  try {
    const item = await ReceivingItem.findOne({
      where: {
        id_penerimaan: req.params.id_penerimaan,
        id_barang: req.params.id_barang,
      },
    });
    if (!item) return res.status(404).json({ error: 'Receiving item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new receiving item
router.post('/', async (req, res) => {
  try {
    const { id_penerimaan, id_barang, jumlah_diterima, kondisi_barang } = req.body;
    if (!id_penerimaan || !id_barang || !jumlah_diterima || !kondisi_barang) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const item = await ReceivingItem.create({ id_penerimaan, id_barang, jumlah_diterima, kondisi_barang });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update receiving item
router.put('/:id_penerimaan/:id_barang', async (req, res) => {
  try {
    const item = await ReceivingItem.findOne({
      where: {
        id_penerimaan: req.params.id_penerimaan,
        id_barang: req.params.id_barang,
      },
    });
    if (!item) return res.status(404).json({ error: 'Receiving item not found' });

    const { jumlah_diterima, kondisi_barang } = req.body;
    if (jumlah_diterima !== undefined) item.jumlah_diterima = jumlah_diterima;
    if (kondisi_barang) item.kondisi_barang = kondisi_barang;

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete receiving item
router.delete('/:id_penerimaan/:id_barang', async (req, res) => {
  try {
    const item = await ReceivingItem.findOne({
      where: {
        id_penerimaan: req.params.id_penerimaan,
        id_barang: req.params.id_barang,
      },
    });
    if (!item) return res.status(404).json({ error: 'Receiving item not found' });
    await item.destroy();
    res.json({ message: 'Receiving item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
