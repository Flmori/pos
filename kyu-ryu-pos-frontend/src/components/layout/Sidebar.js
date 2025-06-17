import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/logo.png'; // Updated path to new logo location

const Sidebar = () => {
  // Dummy user info for now; in real app, get from context or props
  const user = {
    name: 'Sarah',
    role: 'Kasir',
  };

  return (
    <aside className="sidebar bg-dark text-white vh-100">
      <div className="sidebar-header d-flex align-items-center p-3">
        <img src={logo} alt="KyuRyu Logo" className="sidebar-logo me-2" style={{ maxWidth: '150px', height: 'auto' }} />
        <div className="user-info">
          <div className="user-role">{user.role}: {user.name}</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink to="/" className="nav-link text-white" activeClassName="active" exact>
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/users" className="nav-link text-white" activeClassName="active">
              <i className="bi bi-people me-2"></i> Manajemen Pengguna
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/customers" className="nav-link text-white" activeClassName="active">
              <i className="bi bi-person-badge me-2"></i> Manajemen Pelanggan
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/products" className="nav-link text-white" activeClassName="active">
              <i className="bi bi-box-seam me-2"></i> Manajemen Stok Barang
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/sales" className="nav-link text-white" activeClassName="active">
              <i className="bi bi-cart me-2"></i> Transaksi Penjualan
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/receiving" className="nav-link text-white" activeClassName="active">
              <i className="bi bi-inbox me-2"></i> Transaksi Penerimaan Barang
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/reports" className="nav-link text-white" activeClassName="active">
              <i className="bi bi-bar-chart me-2"></i> Laporan
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/logout" className="nav-link text-white" activeClassName="active">
              <i className="bi bi-box-arrow-right me-2"></i> Logout
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
