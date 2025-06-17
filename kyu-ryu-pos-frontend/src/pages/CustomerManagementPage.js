import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Button from '../components/common/Button/Button';
import Input from '../components/common/Input/Input';
import Modal from '../components/common/Modal/Modal';
import Table from '../components/common/Table/Table';

const CustomerManagementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Budi', phone: '08123456789', address: 'Jakarta', memberStatus: 'Active', memberSince: '2023-01-01' },
    { id: 2, name: 'Sari', phone: '08987654321', address: 'Bandung', memberStatus: 'Inactive', memberSince: '2022-12-15' },
  ]);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowModal(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowModal(true);
  };

  const handleDeleteCustomer = (customerId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pelanggan ini?')) {
      setCustomers(customers.filter((customer) => customer.id !== customerId));
    }
  };

  const handleSaveCustomer = (customer) => {
    if (editingCustomer) {
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
    } else {
      setCustomers([...customers, { ...customer, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="customer-management-page">
          <h1>Manajemen Pelanggan</h1>
          <Button onClick={handleAddCustomer}>Tambah Pelanggan Baru</Button>
          <Input
            type="text"
            placeholder="Cari berdasarkan Nama / No. Telepon / ID Member"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Table>
            <thead>
              <tr>
                <th>ID Pelanggan</th>
                <th>Nama Pelanggan</th>
                <th>No. Telepon</th>
                <th>Alamat</th>
                <th>Status Member</th>
                <th>Tgl Daftar Member</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.address}</td>
                  <td>{customer.memberStatus}</td>
                  <td>{customer.memberSince}</td>
                  <td>
                    <Button onClick={() => handleEditCustomer(customer)}>Edit</Button>
                    <Button onClick={() => handleDeleteCustomer(customer.id)}>Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <CustomerForm customer={editingCustomer} onSave={handleSaveCustomer} onCancel={() => setShowModal(false)} />
            </Modal>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const CustomerForm = ({ customer, onSave, onCancel }) => {
  const [name, setName] = useState(customer ? customer.name : '');
  const [phone, setPhone] = useState(customer ? customer.phone : '');
  const [address, setAddress] = useState(customer ? customer.address : '');
  const [isMember, setIsMember] = useState(customer ? customer.memberStatus === 'Active' : false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: customer ? customer.id : null,
      name,
      phone,
      address,
      memberStatus: isMember ? 'Active' : 'Inactive',
      memberSince: isMember ? new Date().toISOString().split('T')[0] : '',
    });
  };

  return (
    <form className="customer-form" onSubmit={handleSubmit}>
      <h2>{customer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</h2>
      <Input
        type="text"
        placeholder="Nama Pelanggan"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="No. Telepon"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Alamat"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={isMember}
          onChange={(e) => setIsMember(e.target.checked)}
        />
        Daftar sebagai Member
      </label>
      <div className="form-buttons">
        <Button type="submit">Simpan</Button>
        <Button type="button" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
};

export default CustomerManagementPage;
