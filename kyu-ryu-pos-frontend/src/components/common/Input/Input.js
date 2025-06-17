import React from 'react';

const Input = ({ type = 'text', value, onChange, className = '', placeholder = '' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`form-control ${className}`}
      placeholder={placeholder}
    />
  );
};

export default Input;
