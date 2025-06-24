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

const initialCustomers = [
  {
    id: 1,
    name: 'John Doe',
    phone: '08123456789',
    address: 'Jl. Merdeka No. 1',
    status: 'Active',
    memberSince: '2022-01-01',
    isMember: true,
    memberId: 'M001'
  },
  {
    id: 2,
    name: 'Jane Smith',
    phone: '08987654321',
    address: 'Jl. Sudirman No. 2',
    status: 'Inactive',
    memberSince: '2021-06-15',
    isMember: false,
    memberId: ''
  }
];

const CustomerManagementPage = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    status: '',
    memberSince: '',
    isMember: false,
    memberId: ''
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toString().includes(searchTerm)
  );

  const handleOpenDialog = (customer = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setFormData({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        status: customer.status,
        memberSince: customer.memberSince,
        isMember: customer.isMember || false,
        memberId: customer.memberId || ''
      });
    } else {
      setEditingCustomer(null);
      setFormData({
        name: '',
        phone: '',
        address: '',
        status: '',
        memberSince: '',
        isMember: false,
        memberId: ''
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

  const generateMemberId = () => {
    // Simple auto-generate logic: M + zero-padded number
    const maxId = customers.reduce((max, c) => {
      const num = parseInt(c.memberId?.replace('M', '') || '0', 10);
      return num > max ? num : max;
    }, 0);
    return `M${(maxId + 1).toString().padStart(3, '0')}`;
  };

  const handleSaveCustomer = () => {
    // Basic validation
    if (!formData.name || !formData.phone || !formData.address || !formData.status || !formData.memberSince) {
      alert('Please fill all fields correctly.');
      return;
    }
    if (formData.isMember && !formData.memberId) {
      alert('Please provide Member ID.');
      return;
    }

    let memberIdToSave = formData.memberId;
    if (formData.isMember && !memberIdToSave) {
      memberIdToSave = generateMemberId();
    }

    if (editingCustomer) {
      // Update customer
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customer, ...formData, memberId: memberIdToSave }
            : customer
        )
      );
    } else {
      // Add new customer
      const newCustomer = {
        id: customers.length ? Math.max(...customers.map((c) => c.id)) + 1 : 1,
        ...formData,
        memberId: memberIdToSave
      };
      setCustomers((prev) => [...prev, newCustomer]);
    }
    setOpenDialog(false);
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID Pelanggan</TableCell>
                      <TableCell>Nama Pelanggan</TableCell>
                      <TableCell>No. Telepon</TableCell>
                      <TableCell>Alamat</TableCell>
                      <TableCell>Status Member</TableCell>
                      <TableCell>Tgl Daftar Member</TableCell>
                      <TableCell>ID Member</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.id}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        <TableCell>{customer.status}</TableCell>
                        <TableCell>{customer.memberSince}</TableCell>
                        <TableCell>{customer.isMember ? customer.memberId : '-'}</TableCell>
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
            label="No. Telepon"
            name="phone"
            value={formData.phone}
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
