import React, { useState } from 'react';
import axios from 'axios';
import ForgotPassword from './ForgotPassword';


function EmailLogin({ onLogin , setIsRegistering}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isResetting, setIsResetting] = useState(false);


  const handleLogin = async () => {
    try {
      const res = await axios.post('https://meechat-backend.onrender.com/login', {
        email,
        password,
      });
      sessionStorage.setItem('user', JSON.stringify(res.data));
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Try again.');
    }
  };

  if (isResetting) {
  return <ForgotPassword onBack={() => setIsResetting(false)} />;
}


  return (
  <div style={wrapper}>
    <form style={form} onSubmit={(e) => {
      e.preventDefault();
      handleLogin();
    }}>
      <h2 style={heading}>Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      <button type="submit" style={button}>Login</button>

      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
  <button
    type="button"
    style={{
      border: 'none',
      background: 'none',
      color: '#007bff',
      cursor: 'pointer',
      fontSize: '1rem',
      textDecoration: 'underline',
      padding: '0.5rem',
    }}
    onClick={() => setIsResetting(true)}
  >
    Forgot Password?
  </button>
</p>


      <p style={switchText}>
        Don't have an account?{' '}
        <button onClick={() => setIsRegistering(true)} style={linkBtn}>
          Register
        </button>
      </p>
      


      {error && <p style={errorText}>{error}</p>}
    </form>
  </div>
);


}

const wrapper = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: '#f4f6f8',
};

const form = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
};

const heading = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  color: '#333',
};

const input = {
  width: '100%',
  padding: '12px',
  marginBottom: '1rem',
  fontSize: '15px',
  borderRadius: '6px',
  border: '1px solid #ccc',
  outline: 'none',
};

const button = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
};

const switchText = {
  marginTop: '1rem',
  textAlign: 'center',
  fontSize: '14px',
};

const linkBtn = {
  background: 'none',
  border: 'none',
  color: '#007bff',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const errorText = {
  color: 'red',
  marginTop: '1rem',
  textAlign: 'center',
};

const inputStyle = {
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  width: '100%',
  marginBottom: '10px',
  fontSize: '14px',
};



export default EmailLogin;
