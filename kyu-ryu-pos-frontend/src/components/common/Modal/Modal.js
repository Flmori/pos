import React from 'react';

const Modal = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${className}`}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
