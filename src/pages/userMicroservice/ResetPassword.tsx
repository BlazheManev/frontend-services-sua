import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { baseUrl } from '../../config';

const PasswordResetForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Retrieve the JWT token from session storage
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        setMessage('User is not authenticated');
        return;
      }

      // Include the JWT token in the request header
      const response = await axios.post(`${baseUrl}:11002/user/reset-pass`, {
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Password reset successful:', response);
      setMessage('Password reset successful');
      // Optionally redirect or update the UI after successful reset
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('Error resetting password');
      // Handle error: show message, set state, etc.
    }
  };

  return (
    <div className="password-reset-container">
      <h2>Reset Password</h2>
      {message && <p className="message">{message}</p>}
      <form className="password-reset-form" onSubmit={handleResetPassword}>
        <input
          className="input-field"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button variant="contained" color="success"  type="submit">Reset Password</Button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
