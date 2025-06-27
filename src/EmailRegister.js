import React, { useState } from 'react';
import axios from 'axios';

function EmailRegister({ onRegistered, setIsRegistering }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const sendOtp = async () => {
    try {
      await axios.post('https://meechat-backend.onrender.com/send_email_otp', {
        email,
        username,
      });
      setOtpSent(true);
      setMessage('OTP sent to your email!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP.');
      setMessage('');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('https://meechat-backend.onrender.com/verify_email_otp_and_register', {
        email,
        otp,
        password,
      });
    sessionStorage.setItem('user', JSON.stringify(res.data));
      onRegistered(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed.');
    }
  };

  return (
  <div style={wrapper}>
    <form
      style={form}
      onSubmit={(e) => {
        e.preventDefault();
        otpSent ? handleRegister() : sendOtp();
      }}
    >
      <h2 style={headingStyle}>Register</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={input}
        disabled={otpSent}
      />

      <input
        type="text"
        placeholder="Choose username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={input}
        disabled={otpSent}
      />

      {!otpSent ? (
        <button type="submit" style={button}>
          Send OTP
        </button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={input}
          />
          <input
            type="password"
            placeholder="Set password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
          />
          <button type="submit" style={button}>
            Register
          </button>
        </>
      )}

      <p style={switchText}>
        Already have an account?{' '}
        <button
          onClick={() => setIsRegistering(false)}
          style={linkBtn}
          type="button"
        >
          Login
        </button>
      </p>

      {message && <p style={successText}>{message}</p>}
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

const headingStyle = {
  fontSize: '24px',
  marginBottom: '1rem',
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
  backgroundColor: '#28a745',
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

const successText = {
  color: 'green',
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




export default EmailRegister;
