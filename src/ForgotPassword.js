import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword({ onBack }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const sendOtp = async () => {
    try {
      await axios.post('https://meechat-backend.onrender.com/request-password-reset', { email },{
    headers: {
      'Content-Type': 'application/json'
    }
  });
      setMessage("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setMessage("Failed to send OTP. Try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('https://meechat-backend.onrender.com/verify-reset-otp', { email, otp });
      setStep(3);
      setMessage('');
    } catch (err) {
      setMessage("Invalid or expired OTP.");
    }
  };

  const resetPassword = async () => {
    try {
      await axios.post('https://meechat-backend.onrender.com/reset-password', {
        email,
        otp,
        new_password: newPassword,
      });
      alert("Password updated! You can log in now.");
      onBack(); // go back to login
    } catch (err) {
      setMessage("Reset failed.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Reset Password</h2>
      {step === 1 && (
        <>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          <button onClick={sendOtp} style={btnStyle}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={inputStyle}
          />
          <button onClick={verifyOtp} style={btnStyle}>Verify OTP</button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          />
          <button onClick={resetPassword} style={btnStyle}>Set New Password</button>
        </>
      )}

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <p style={{ marginTop: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>
          ← Back to Login
        </button>
      </p>
    </div>
  );
}

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ccc',
};

const btnStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
};

export default ForgotPassword;
