import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../../styles/AddTerminForm.css'; // Import your CSS file

interface AddTerminFormProps {
  onTerminAdded?: () => void;
}

const AddTerminForm: React.FC<AddTerminFormProps> = ({ onTerminAdded }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');
    if (isLoggedIn === false) {
      navigate('/');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    patientId: '',
    dateTime: new Date(), // Initial value for date-time
    serviceType: '',
    doctor: '',
    specialRequests: '',
  });

  const handleChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        dateTime: date,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');

      const response = await axios.post(
        'http://localhost:11005/api/termini/create',
        formData,
        {
          headers: {
            Authorization: `${token}`, // Include the JWT token in the headers
            'Content-Type': 'application/json', // Adjust content type if necessary
          },
        }
      );

      setFormData({
        patientId: '',
        dateTime: new Date(),
        serviceType: '',
        doctor: '',
        specialRequests: '',
      });

      // Trigger the parent component to update termini list after adding a new termin
      if (onTerminAdded) {
        onTerminAdded();
      }
    } catch (error) {
      console.error('Error adding termin:', error);
    }
  };

  return (
    <div className="add-termin-container">
      <h2>Add New Termin</h2>
      <form className="termin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date Time:</label>
          <DatePicker
            selected={formData.dateTime}
            onChange={(date: Date | null) => handleChange(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
          />
        </div>
        <div className="form-group">
          <label>Service Type:</label>
          <input type="text" name="serviceType" value={formData.serviceType} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Doctor:</label>
          <input type="text" name="doctor" value={formData.doctor} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Special Requests:</label>
          <input type="text" name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} />
        </div>
        <button className="submit-button" type="submit">Add Termin</button>
      </form>
    </div>
  );
};

export default AddTerminForm;
