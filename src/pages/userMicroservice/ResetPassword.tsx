import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:11002/user/reset-pass', {
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
        <button className="reset-button" type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default PasswordResetForm;
