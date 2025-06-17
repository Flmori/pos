import React from 'react';

const Header = () => {
  // Dummy user info for now; in real app, get from context or props
  const user = {
    name: 'Sarah',
    role: 'Kasir',
  };

  const handleLogout = () => {
    // Implement logout logic here
    alert('Logout clicked');
  };

  return (
    <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
      <div className="header-left d-flex align-items-center">
        <i className="bi bi-windows fs-3 me-2"></i>
        <h1 className="m-0 fs-4">SIKASIR</h1>
      </div>
      <div className="header-right d-flex align-items-center">
        <span className="me-3"><i className="bi bi-person-circle"></i> User: {user.name}</span>
        <button className="btn btn-link text-white text-decoration-none" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-1"></i> Keluar
        </button>
      </div>
    </header>
  );
};

export default Header;
