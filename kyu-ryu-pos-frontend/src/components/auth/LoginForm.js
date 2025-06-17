import React, { useState } from 'react';
import Input from '../common/Input/Input';
import Button from '../common/Button/Button';

const LoginForm = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy login validation for demonstration
    if (userId === 'admin' && password === 'password') {
      setError('');
      alert('Login successful');
      // Redirect or further logic here
    } else {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      if (newAttempts > 0) {
        setError("ID Pengguna atau Password salah. Anda memiliki " + newAttempts + " percobaan tersisa.");
      } else {
        setError('Anda telah mencapai batas percobaan login. Silakan coba lagi nanti.');
        // Reset or lockout logic here
      }
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <Input
        type="text"
        placeholder="ID Pengguna"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="login-input"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="login-input"
      />
      {error && <div className="error-message">{error}</div>}
      <Button type="submit" className="login-button">Login</Button>
    </form>
  );
};

export default LoginForm;
