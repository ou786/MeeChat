import React, { useState } from 'react';
import axios from 'axios';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/register', { username });
      const user = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      onLogin(user);
    } catch (err) {
      setError('Login failed. Try another username.');
      console.error(err);
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={{ marginBottom: '1rem' }}>Login</h2>
        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
          />
          
          <button type="submit" style={buttonStyle}>Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
}

const container = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#e9ecef',
};

const card = {
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

const formStyle = {
  display: 'flex',
  gap: '10px',
};

const inputStyle = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  flex: 1,
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#0d6efd',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default LoginPage;
