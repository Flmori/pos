import express from 'express';
import User from '../models/User.js';
import Role from '../models/Role.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ include: Role });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ where: { id_user: req.params.id }, include: Role });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new user
router.post('/', async (req, res) => {
  try {
    const { username, password, nama_lengkap, id_role, email } = req.body;
    if (!username || !password || !nama_lengkap || !id_role) {
      console.error('Missing required fields:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }
    console.log('Create user request payload:', req.body);
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      console.error('Username already exists:', username);
      return res.status(400).json({ error: 'Username already exists' });
    }
    const user = await User.create({ username, password, nama_lengkap, id_role, email });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ where: { id_user: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { username, password, nama_lengkap, id_role, email } = req.body;

    if (username) user.username = username;
    if (password) user.password = password;
    if (nama_lengkap) user.nama_lengkap = nama_lengkap;
    if (id_role) user.id_role = id_role;
    if (email) user.email = email;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findOne({ where: { id_user: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', username);
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = await User.findOne({ where: { username }, include: Role });
    if (!user) {
      console.log('User not found:', username);
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // On successful login, return user info (excluding password)
    const userJson = user.toJSON();
    const { password: _, ...userData } = userJson;
    // Add role name from associated Role model
    userData.role = userJson.Role ? userJson.Role.nama_role : null;
    console.log('Login successful:', username);
    res.json({ message: 'Login successful', user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
