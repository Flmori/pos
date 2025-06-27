
import express from 'express';
import moment from 'moment';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import { Sequelize } from 'sequelize';

const router = express.Router();

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.findAll();
    res.json(sales);
  } catch (error) {
    console.error('Transaction save error:', error.stack || error.message || error);
    res.status(500).json({ error: error.stack || error.message || error });
  }
});

router.get('/sales-report', async (req, res) => {
  try {
    // Get all sales with related Product and include necessary fields
    const sales = await Sale.findAll({
      attributes: [
        'id_penjualan',
        'no_nota',
        'id_barang',
        'jumlah_barang',
        'harga_per_unit',
        ['subtotal_item', 'total_bayar'],
        ['created_at', 'tanggal_transaksi'],
      ],
    include: [
      {
        model: Product,
        attributes: ['nama_barang'],
      },
    ],
      order: [['created_at', 'DESC']],
    });

    // Map sales to plain objects and include product info
    const salesData = sales.map(sale => {
      const saleJson = sale.toJSON();
      return {
        id_penjualan: saleJson.id_penjualan,
        no_nota: saleJson.no_nota,
        id_barang: saleJson.id_barang,
        jumlah_barang: saleJson.jumlah_barang,
        harga_per_unit: saleJson.harga_per_unit,
        total_bayar: saleJson.total_bayar,
        tanggal_transaksi: saleJson.tanggal_transaksi,
        nama_barang: saleJson.Product?.nama_barang || null,
        kategori: saleJson.Product?.kategori || null,
      };
    });

    res.json(salesData);
  } catch (error) {
    console.error('Sales Report Error:', error);
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

router.post('/transaction', async (req, res) => {
  try {
    const { customerId, paymentType, amountPaid, cartItems, discountAmount, totalPrice, totalPayable, cashierId, useDiscount } = req.body;
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    const requiredFields = ['id_barang', 'jumlah_barang', 'harga_per_unit', 'subtotal_item'];
    for (const field of requiredFields) {
      if (cartItems[0][field] === undefined || cartItems[0][field] === null) {
        return res.status(400).json({ error: `Missing required field '${field}' in first cart item` });
      }
    }

    // Generate id_penjualan and no_nota once for the transaction
    const prefix = 'SLTS-';
    const lastSale = await Sale.findOne({
      where: {
        id_penjualan: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['id_penjualan', 'DESC']],
    });
    let newIdPenjualan;
    if (lastSale) {
      const lastIdNum = parseInt(lastSale.id_penjualan.replace(prefix, ''), 10);
      const newIdNum = lastIdNum + 1;
      newIdPenjualan = prefix + newIdNum.toString().padStart(3, '0');
    } else {
      newIdPenjualan = prefix + '001';
    }

    // Generate no_nota as yyyymmdd + 4 digit sequence reset daily
    const datePrefix = moment().format('YYYYMMDD');
    const likePattern = `${datePrefix}%`;

    const lastNoNota = await Sale.findOne({
      where: {
        no_nota: {
          [Op.like]: likePattern
        }
      },
      order: [['no_nota', 'DESC']],
    });

    let newNoNota;
    if (lastNoNota && lastNoNota.no_nota) {
      const lastSeq = parseInt(lastNoNota.no_nota.toString().slice(8), 10);
      newNoNota = parseInt(datePrefix + (lastSeq + 1).toString().padStart(4, '0'), 10);
    } else {
      newNoNota = parseInt(datePrefix + '0001', 10);
    }

    // Calculate total quantity of items for loyalty points
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.jumlah_barang, 0);

    // Calculate loyalty points earned: 10 points per item
    const pointsEarned = totalQuantity * 10;

    // Calculate discount percentage based on customer's current loyalty points if useDiscount is true
    let discountPercent = 0;
    let currentLoyaltyPoints = 0;
    if (customerId) {
      const customer = await Customer.findByPk(customerId);
      if (customer && customer.is_member) {
        currentLoyaltyPoints = customer.poin_loyalitas || 0;
        if (useDiscount) {
          discountPercent = Math.min(Math.floor(currentLoyaltyPoints / 10) * 1, 20);
        }
      }
    }

    // Calculate discount amount
    const calculatedDiscountAmount = (totalPrice * discountPercent) / 100;

    // Adjust total payable based on discount
    const adjustedTotalPayable = totalPrice - calculatedDiscountAmount;

    // Create sale records for each cart item with the same id_penjualan and no_nota
    const salesToCreate = cartItems.map(item => ({
      id_penjualan: newIdPenjualan,
      no_nota: newNoNota,
      id_barang: item.id_barang,
      jumlah_barang: item.jumlah_barang,
      harga_per_unit: item.harga_per_unit,
      subtotal_item: item.subtotal_item,
    }));

    let createdSales;
    try {
      createdSales = await Sale.bulkCreate(salesToCreate);
    } catch (bulkError) {
      console.error('Bulk create error:', bulkError);
      if (bulkError.name === 'SequelizeValidationError') {
        console.error('Validation errors:', bulkError.errors);
      }
      throw bulkError;
    }

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
        if (useDiscount) {
          // Deduct loyalty points based on discount used (each 1% discount = 10 points)
          const pointsToDeduct = Math.min(currentLoyaltyPoints, Math.floor(discountPercent / 1) * 10);
          customer.poin_loyalitas = currentLoyaltyPoints - pointsToDeduct + pointsEarned;
        } else {
          // Just add points earned
          customer.poin_loyalitas = currentLoyaltyPoints + pointsEarned;
        }
        await customer.save();
      }
    }

    res.status(201).json({
      id_penjualan: newIdPenjualan,
      no_nota: newNoNota,
      sales: createdSales,
      discountPercent,
      discountAmount: calculatedDiscountAmount,
      totalPayable: adjustedTotalPayable,
      pointsEarned,
    });
  } catch (error) {
    console.error('Transaction save error:', error.stack || error.message || error);
    if (error.name === 'SequelizeValidationError') {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({ error: error.stack || error.message || error });
  }
});
import { fn, col, literal } from 'sequelize';

// New route for daily sales summary
router.get('/daily-sales-summary', async (req, res) => {
  try {
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    // Sum subtotal_item as total sales and count distinct id_penjualan as transaction count
    const totalSalesResult = await Sale.findOne({
      attributes: [[fn('SUM', col('subtotal_item')), 'totalSales']],
      where: {
        created_at: {
          [Op.between]: [startOfDay, endOfDay]
        }
      },
      raw: true
    });

    const transactionCountResult = await Sale.count({
      distinct: true,
      col: 'id_penjualan',
      where: {
        created_at: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    });

    const totalSales = totalSalesResult.totalSales || 0;
    const transactionCount = transactionCountResult || 0;

    res.json({
      totalSales,
      transactionCount
    });
  } catch (error) {
    console.error('Daily Sales Summary Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
