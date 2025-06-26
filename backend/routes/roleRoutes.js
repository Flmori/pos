import express from 'express';
import Role from '../models/Role.js';

const router = express.Router();

// Get all roles
router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get role by id
router.get('/:id', async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new role
router.post('/', async (req, res) => {
  try {
    const { nama_role } = req.body;
    if (!nama_role) {
      return res.status(400).json({ error: 'nama_role is required' });
    }
    const role = await Role.create({ nama_role });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update role
router.put('/:id', async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });

    const { nama_role } = req.body;
    if (nama_role) role.nama_role = nama_role;

    await role.save();
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete role
router.delete('/:id', async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    await role.destroy();
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
