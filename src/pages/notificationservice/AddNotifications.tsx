import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import '../../styles/Login.css'; // Import your CSS file

const AddNotificationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.post('http://localhost:11003/notifications', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Reset form or handle success
      setFormData({ title: '', message: '' });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Add New Notification</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
          className="input-field"
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => handleInputChange(e, 'title')}
          />
        </div>
        <div className="form-group">
          <label>Message:</label>
          <input
          className="input-field"
            type="text"
            name="message"
            value={formData.message}
            onChange={(e) => handleInputChange(e, 'message')}
          />
        </div>
        <Button variant="contained" color="primary" type="submit">Add Notification</Button>
      </form>
    </div>
  );
};

export default AddNotificationForm;
