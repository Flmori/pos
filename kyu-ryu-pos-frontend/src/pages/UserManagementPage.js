import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Button from '../components/common/Button/Button';
import Input from '../components/common/Input/Input';
import Modal from '../components/common/Modal/Modal';
import Table from '../components/common/Table/Table';

const UserManagementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', fullName: 'Admin User', role: 'Owner', email: 'admin@example.com' },
    { id: 2, username: 'kasir1', fullName: 'Kasir Satu', role: 'Kasir', email: 'kasir1@example.com' },
  ]);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleSaveUser = (user) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    } else {
      setUsers([...users, { ...user, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="user-management-page">
          <h1>Manajemen Pengguna Sistem</h1>
          <Button onClick={handleAddUser}>Tambah Pengguna Baru</Button>
          <Input
            type="text"
            placeholder="Cari berdasarkan Username / Nama"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Table>
            <thead>
              <tr>
                <th>ID User</th>
                <th>Username</th>
                <th>Nama Lengkap</th>
                <th>Peran</th>
                <th>Email</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button onClick={() => handleEditUser(user)}>Edit</Button>
                    <Button onClick={() => handleDeleteUser(user.id)}>Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <UserForm user={editingUser} onSave={handleSaveUser} onCancel={() => setShowModal(false)} />
            </Modal>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const UserForm = ({ user, onSave, onCancel }) => {
  const [fullName, setFullName] = useState(user ? user.fullName : '');
  const [username, setUsername] = useState(user ? user.username : '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState(user ? user.role : 'Owner');
  const [email, setEmail] = useState(user ? user.email : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    onSave({
      id: user ? user.id : null,
      fullName,
      username,
      role,
      email,
    });
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{user ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</h2>
      <Input
        type="text"
        placeholder="Nama Lengkap"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required={!user}
      />
      <Input
        type="password"
        placeholder="Konfirmasi Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required={!user}
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="Owner">Owner</option>
        <option value="Kasir">Kasir</option>
        <option value="Pegawai Gudang">Pegawai Gudang</option>
      </select>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <div className="form-buttons">
        <Button type="submit">Simpan</Button>
        <Button type="button" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
};

export default UserManagementPage;
