
import express from 'express';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

const router = express.Router();

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sale by composite key (id_penjualan and id_barang)
router.get('/:id_penjualan/:id_barang', async (req, res) => {
  try {
    const sale = await Sale.findOne({
      where: {
        id_penjualan: req.params.id_penjualan,
        id_barang: req.params.id_barang,
      },
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new sale
router.post('/', async (req, res) => {
  try {
    const { id_penjualan, id_barang, jumlah_barang, harga_per_unit, subtotal_item } = req.body;
    if (!id_penjualan || !id_barang || !jumlah_barang || !harga_per_unit || !subtotal_item) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const sale = await Sale.create({ id_penjualan, id_barang, jumlah_barang, harga_per_unit, subtotal_item });
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update sale
router.put('/:id_penjualan/:id_barang', async (req, res) => {
  try {
    const sale = await Sale.findOne({
      where: {
        id_penjualan: req.params.id_penjualan,
        id_barang: req.params.id_barang,
      },
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });

    const { jumlah_barang, harga_per_unit, subtotal_item } = req.body;
    if (jumlah_barang !== undefined) sale.jumlah_barang = jumlah_barang;
    if (harga_per_unit !== undefined) sale.harga_per_unit = harga_per_unit;
    if (subtotal_item !== undefined) sale.subtotal_item = subtotal_item;

    await sale.save();
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete sale
router.delete('/:id_penjualan/:id_barang', async (req, res) => {
  try {
    const sale = await Sale.findOne({
      where: {
        id_penjualan: req.params.id_penjualan,
        id_barang: req.params.id_barang,
      },
    });
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    await sale.destroy();
    res.json({ message: 'Sale deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// New route to create a full sales transaction with multiple sale items
router.post('/transaction', async (req, res) => {
  try {
    const { customerId, paymentType, amountPaid, cartItems, discountAmount, totalPrice, totalPayable, cashierId } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    // Generate id_penjualan and no_nota once for the transaction
    // We can create a dummy Sale instance to trigger beforeCreate hook to get id_penjualan and no_nota
    const dummySale = await Sale.create({
      id_barang: cartItems[0].id_barang,
      jumlah_barang: cartItems[0].jumlah_barang,
      harga_per_unit: cartItems[0].harga_per_unit,
      subtotal_item: cartItems[0].subtotal_item,
    });

    const id_penjualan = dummySale.id_penjualan;
    const no_nota = dummySale.no_nota;

    // Delete the dummy sale record
    await dummySale.destroy();

    // Create sale records for each cart item with the same id_penjualan and no_nota
    const salesToCreate = cartItems.map(item => ({
      id_penjualan,
      no_nota,
      id_barang: item.id_barang,
      jumlah_barang: item.jumlah_barang,
      harga_per_unit: item.harga_per_unit,
      subtotal_item: item.subtotal_item,
    }));

    const createdSales = await Sale.bulkCreate(salesToCreate);

    // Update stock for each product
    for (const item of cartItems) {
      const product = await Product.findByPk(item.id_barang);
      if (product) {
        product.stok = product.stok - item.jumlah_barang;
        await product.save();
      }
    }

    // Update customer loyalty points if member
    if (customerId) {
      const customer = await Customer.findByPk(customerId);
      if (customer && customer.is_member) {
        // For example, add 1 point for every 10000 spent (customize as needed)
        const pointsToAdd = Math.floor(totalPayable / 10000);
        customer.poin_loyalitas = (customer.poin_loyalitas || 0) + pointsToAdd;
        await customer.save();
      }
    }

    res.status(201).json({ id_penjualan, no_nota, sales: createdSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
