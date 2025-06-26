import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './config/database.js';
import Role from './models/Role.js';
import * as User from './models/User.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import Customer from './models/Customer.js';
import Sale from './models/Sale.js';
import ReceivingTransaction from './models/ReceivingTransaction.js';
import ReceivingItem from './models/ReceivingItem.js';
import userRoutes from './routes/userRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import receivingTransactionRoutes from './routes/receivingTransactionRoutes.js';
import receivingItemRoutes from './routes/receivingItemRoutes.js';

import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create a write stream (in append mode) for error logs
const errorLogStream = fs.createWriteStream(path.join(process.cwd(), 'backend_error.log'), { flags: 'a' });

// Add request logging middleware to log method and URL
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Explicitly handle OPTIONS preflight requests for all routes
app.options('*', cors());

app.use(express.json());

// Routes
app.use('/toko-kyu-ryu/api/users', userRoutes);
app.use('/toko-kyu-ryu/api/roles', roleRoutes);
app.use('/toko-kyu-ryu/api/categories', categoryRoutes);
app.use('/toko-kyu-ryu/api/products', productRoutes);
app.use('/toko-kyu-ryu/api/customers', customerRoutes);
app.use('/toko-kyu-ryu/api/sales', saleRoutes);
app.use('/toko-kyu-ryu/api/receiving-transactions', receivingTransactionRoutes);
app.use('/toko-kyu-ryu/api/receiving-items', receivingItemRoutes);

// Add explicit OPTIONS handler for login route to ensure CORS headers are sent
app.options('/toko-kyu-ryu/api/users/login', cors(), (req, res) => {
  res.sendStatus(204);
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Toko KyuRyu Backend API is running' });
});

// Error handling middleware to log errors to file
app.use((err, req, res, next) => {
  const errorMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} - ${err.stack || err.message || err}\n`;
  console.error(errorMessage);
  errorLogStream.write(errorMessage);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    const errorMessage = `[${new Date().toISOString()}] Unable to sync database: ${err.stack || err.message || err}\n`;
    console.error(errorMessage);
    errorLogStream.write(errorMessage);
  });
