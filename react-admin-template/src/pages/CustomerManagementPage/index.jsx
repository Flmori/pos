import React, { useState, useEffect } from 'react';
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
  FormControl,
  Checkbox,
  FormControlLabel
} from '@mui/material';

// project import
import Breadcrumb from 'component/Breadcrumb';
import { gridSpacing } from 'config.js';

// icons
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// ==============================|| CUSTOMER MANAGEMENT PAGE ||============================== //

const statuses = ['Active', 'Inactive'];

const mapBackendToFrontend = (customer) => ({
  id: customer.id_pelanggan,
  name: customer.nama_pelanggan,
  waNumber: customer.no_wa,
  address: customer.alamat,
  status: customer.is_member ? 'Active' : 'Inactive',
  memberSince: customer.tgl_daftar_member ? customer.tgl_daftar_member.split('T')[0] : '',
  isMember: customer.is_member,
  loyaltyPoints: customer.poin_loyalitas || 0
});

const mapFrontendToBackend = (customer) => ({
  nama_pelanggan: customer.name,
  no_wa: customer.waNumber,
  alamat: customer.address,
  is_member: customer.isMember,
  tgl_daftar_member: customer.memberSince || null,
  poin_loyalitas: customer.loyaltyPoints
});

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    waNumber: '',
    address: '',
    status: '',
    memberSince: '',
    isMember: false,
    loyaltyPoints: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8000/toko-kyu-ryu/api/customers'; // Updated to match backend server and path

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch customers');
      const data = await response.json();
      const mapped = data.map(mapBackendToFrontend);
      setCustomers(mapped);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.waNumber.includes(searchTerm) ||
      customer.id.toString().includes(searchTerm)
  );

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        waNumber: customer.waNumber,
        address: customer.address,
        status: customer.status,
        memberSince: customer.memberSince,
        isMember: customer.isMember || false,
        loyaltyPoints: customer.loyaltyPoints || 0
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        waNumber: '',
        address: '',
        status: '',
        memberSince: '',
        isMember: false,
        loyaltyPoints: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveCustomer = async () => {
    // Basic validation
    if (!formData.name || !formData.waNumber || !formData.address || !formData.status || !formData.memberSince) {
      alert('Please fill all fields correctly.');
      return;
    }

    const customerToSave = {
      ...formData,
      isMember: formData.status === 'Active',
    };

    const backendData = mapFrontendToBackend(customerToSave);

    try {
      let response;
      if (editingCustomer) {
        // Update customer
        response = await fetch(`${API_BASE_URL}/${editingCustomer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendData)
        });
      } else {
        // Add new customer
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendData)
        });
      }
      if (!response.ok) throw new Error('Failed to save customer');
      const savedCustomer = await response.json();
      const mappedCustomer = mapBackendToFrontend(savedCustomer);

      setCustomers((prev) => {
        if (editingCustomer) {
          return prev.map((c) => (c.id === mappedCustomer.id ? mappedCustomer : c));
        } else {
          return [...prev, mappedCustomer];
        }
      });
      setOpenDialog(false);
      // Reload customers after save to refresh UI
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
          method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete customer');
        setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <>
      <Breadcrumb title="Manajemen Pelanggan">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Manajemen Pelanggan
        </Typography>
      </Breadcrumb>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">Manajemen Pelanggan</Typography>
                  <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                    Tambah Pelanggan Baru
                  </Button>
                </Grid>
              }
            />
            <Divider />
            <CardContent>
              <TextField
                label="Cari berdasarkan Nama / No. Telepon / ID Member"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {loading && <Typography>Loading...</Typography>}
              {error && <Typography color="error">{error}</Typography>}
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Pelanggan</TableCell>
                      <TableCell>Nama Pelanggan</TableCell>
                      <TableCell>Nomor WA</TableCell>
                      <TableCell>Alamat</TableCell>
                      <TableCell>Status Member</TableCell>
                      <TableCell>Tgl Daftar Member</TableCell>
                      <TableCell>Point Loyalitas</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.waNumber}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>{customer.status}</TableCell>
                        <TableCell>{customer.memberSince}</TableCell>
                        <TableCell>{customer.loyaltyPoints}</TableCell>
                        <TableCell>
                          <IconButton color="primary" onClick={() => handleOpenDialog(customer)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteCustomer(customer.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          Tidak ada pelanggan ditemukan.
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
        <DialogTitle>{editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nama Pelanggan"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Nomor WA"
            name="waNumber"
            value={formData.waNumber}
            onChange={handleFormChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Alamat"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            fullWidth
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status Member</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              label="Status Member"
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Tgl Daftar Member"
            name="memberSince"
            type="date"
            value={formData.memberSince}
            onChange={handleFormChange}
            fullWidth
            InputLabelProps={{
              shrink: true
            }}
          />
          <TextField
            margin="dense"
            label="Point Loyalitas"
            name="loyaltyPoints"
            type="number"
            value={formData.loyaltyPoints}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button variant="contained" color="primary" onClick={handleSaveCustomer}>
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CustomerManagementPage;
