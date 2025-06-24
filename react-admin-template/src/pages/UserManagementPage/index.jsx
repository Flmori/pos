import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';

// project import
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

// icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ==============================|| USER MANAGEMENT PAGE ||============================== //

const roles = ['Owner', 'Kasir', 'Pegawai Gudang'];

const initialUsers = [
  { id: 1, username: 'owner1', fullName: 'Owner One', role: 'Owner', email: 'owner1@example.com' },
  { id: 2, username: 'kasir1', fullName: 'Kasir One', role: 'Kasir', email: 'kasir1@example.com' },
  { id: 3, username: 'gudang1', fullName: 'Gudang One', role: 'Pegawai Gudang', email: 'gudang1@example.com' }
];

const UserManagementPage = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    email: ''
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        fullName: user.fullName,
        username: user.username,
        password: '',
        confirmPassword: '',
        role: user.role,
        email: user.email
      });
    } else {
      setEditingUser(null);
      setFormData({
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        role: '',
        email: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveUser = () => {
    // Basic validation
    if (
      !formData.fullName ||
      !formData.username ||
      (!editingUser && !formData.password) ||
      formData.password !== formData.confirmPassword ||
      !formData.role ||
      !formData.email
    ) {
      alert('Please fill all fields correctly.');
      return;
    }

    if (editingUser) {
      // Update user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingUser.id
            ? { ...user, ...formData, password: undefined, confirmPassword: undefined }
            : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
        fullName: formData.fullName,
        username: formData.username,
        role: formData.role,
        email: formData.email
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setOpenDialog(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  return (
    <>
      <Breadcrumb title="Manajemen Pengguna Sistem">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Manajemen Pengguna Sistem
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">Manajemen Pengguna Sistem</Typography>
                  <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                    Tambah Pengguna Baru
                  </Button>
                </Grid>
              }
            />
            <Divider />
            <CardContent>
              <TextField
                label="Cari berdasarkan Username / Nama"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID User</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Nama Lengkap</TableCell>
                      <TableCell>Peran</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.id}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleOpenDialog(user)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteUser(user.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredUsers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Tidak ada pengguna ditemukan.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Lengkap"
            name="fullName"
            value={formData.fullName}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Konfirmasi Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleFormChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="role-label">Peran</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleFormChange}
              label="Peran"
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button variant="contained" color="primary" onClick={handleSaveUser}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserManagementPage;
