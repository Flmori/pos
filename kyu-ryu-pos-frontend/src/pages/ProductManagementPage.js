import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import Button from '../components/common/Button/Button';
import Input from '../components/common/Input/Input';
import Modal from '../components/common/Modal/Modal';
import Table from '../components/common/Table/Table';

const categories = ['Semua', 'Kopi', 'Makanan', 'Minuman Non-Kopi'];

const ProductManagementPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');
  const [products, setProducts] = useState([
    { id: 1, code: 'KP001', name: 'Kopi Arabika', category: 'Kopi', purchasePrice: 20000, salePrice: 25000, stock: 10, description: 'Kopi Arabika pilihan' },
    { id: 2, code: 'MK001', name: 'Mie Goreng', category: 'Makanan', purchasePrice: 10000, salePrice: 15000, stock: 5, description: 'Mie goreng spesial' },
  ]);
  const [editingProduct, setEditingProduct] = useState(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Semua' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      setProducts(products.filter((product) => product.id !== productId));
    }
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)));
    } else {
      setProducts([...products, { ...product, id: Date.now() }]);
    }
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="product-management-page">
          <h1>Manajemen Stok Barang</h1>
          <Button onClick={handleAddProduct}>Tambah Barang Baru</Button>
          <Input
            type="text"
            placeholder="Cari berdasarkan Nama Barang / Kode Barang"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="category-filter">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <Table>
            <thead>
              <tr>
                <th>Kode Barang</th>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Harga Beli</th>
                <th>Harga Jual</th>
                <th>Stok Saat Ini</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.code}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.purchasePrice}</td>
                  <td>{product.salePrice}</td>
                  <td>{product.stock}</td>
                  <td>{product.description}</td>
                  <td>
                    <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                    <Button onClick={() => handleDeleteProduct(product.id)}>Hapus</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <ProductForm product={editingProduct} onSave={handleSaveProduct} onCancel={() => setShowModal(false)} />
            </Modal>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

const ProductForm = ({ product, onSave, onCancel }) => {
  const [code, setCode] = React.useState(product ? product.code : '');
  const [name, setName] = React.useState(product ? product.name : '');
  const [category, setCategory] = React.useState(product ? product.category : 'Kopi');
  const [purchasePrice, setPurchasePrice] = React.useState(product ? product.purchasePrice : '');
  const [salePrice, setSalePrice] = React.useState(product ? product.salePrice : '');
  const [stock, setStock] = React.useState(product ? product.stock : '');
  const [description, setDescription] = React.useState(product ? product.description : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: product ? product.id : null,
      code,
      name,
      category,
      purchasePrice: Number(purchasePrice),
      salePrice: Number(salePrice),
      stock: Number(stock),
      description,
    });
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <h2>{product ? 'Edit Barang' : 'Tambah Barang Baru'}</h2>
      <Input
        type="text"
        placeholder="Kode Barang"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Nama Barang"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)} required>
        <option value="Kopi">Kopi</option>
        <option value="Makanan">Makanan</option>
        <option value="Minuman Non-Kopi">Minuman Non-Kopi</option>
      </select>
      <Input
        type="number"
        placeholder="Harga Beli"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Harga Jual"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
        required
      />
      <Input
        type="number"
        placeholder="Stok Awal"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Deskripsi"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="form-buttons">
        <Button type="submit">Simpan</Button>
        <Button type="button" onClick={onCancel}>Batal</Button>
      </div>
    </form>
  );
};

export default ProductManagementPage;
