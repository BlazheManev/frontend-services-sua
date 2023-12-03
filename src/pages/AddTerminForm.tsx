import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AddTerminFormProps {
  onTerminAdded?: () => void;
}

const AddTerminForm: React.FC<AddTerminFormProps> = ({ onTerminAdded }) => {
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
      await axios.post('http://localhost:11005/api/termini/create', formData);
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
    <div>
      <h2>Add New Termin</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Patient ID:
          <input type="text" name="patientId" value={formData.patientId} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Date Time:
          <DatePicker
            selected={formData.dateTime}
            onChange={(date: Date | null) => handleChange(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
          />
        </label>
        <br />
        <label>
          Service Type:
          <input type="text" name="serviceType" value={formData.serviceType} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Doctor:
          <input type="text" name="doctor" value={formData.doctor} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Special Requests:
          <input type="text" name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Add Termin</button>
      </form>
    </div>
  );
};

export default AddTerminForm;
