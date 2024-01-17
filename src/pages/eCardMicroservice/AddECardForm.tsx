import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/AddTerminForm.css';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  __v?: number;
}

const AddECardForm: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    userId: '',
    dateOfBirth: new Date(),
    weight: 0,
    height: 0,
    bloodType: '',
    diseases: [{ diseaseName: '' }],
    appointments: [''],
  });

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');
    if (!isLoggedIn) {
      navigate('/');
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:11002/users', {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwtToken')}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, dateOfBirth: date });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDisease = () => {
    setFormData({
      ...formData,
      diseases: [...formData.diseases, { diseaseName: '' }],
    });
  };

  const handleDiseaseChange = (index: number, value: string) => {
    const updatedDiseases = formData.diseases.map((disease, i) =>
      i === index ? { diseaseName: value } : disease
    );
    setFormData({ ...formData, diseases: updatedDiseases });
  };

  const handleRemoveDisease = (index: number) => {
    const updatedDiseases = formData.diseases.filter((_, i) => i !== index);
    setFormData({ ...formData, diseases: updatedDiseases });
  };

  const handleAddAppointment = () => {
    setFormData({
      ...formData,
      appointments: [...formData.appointments, ''],
    });
  };

  const handleAppointmentChange = (index: number, value: string) => {
    const updatedAppointments = formData.appointments.map((appointment, i) =>
      i === index ? value : appointment
    );
    setFormData({ ...formData, appointments: updatedAppointments });
  };

  const handleRemoveAppointment = (index: number) => {
    const updatedAppointments = formData.appointments.filter((_, i) => i !== index);
    setFormData({ ...formData, appointments: updatedAppointments });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.post('http://localhost:11001/eCard', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Reset form or navigate away after successful post
      // setFormData({ ...initial state });
    } catch (error) {
      console.error('Error creating eCard:', error);
    }
  };

  return (
    
    <div className="add-ecard-container">
      <h2>Add New eCard</h2>
      <form className="termin-form" onSubmit={handleSubmit}>
      <div className="form-group">
          <label>User:</label>
          <select name="userId" value={formData.userId} onChange={handleInputChange}>
            <option value="">Select a User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>{user.username}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <DatePicker
            selected={formData.dateOfBirth}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="form-group">
          <label>Weight:</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Height:</label>
          <input
            type="number"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
          />
        </div>
        {/* Diseases Section */}
        <div className="form-group">
          <label>Diseases:</label>
          {formData.diseases.map((disease, index) => (
            <div key={index}>
              <input
                type="text"
                value={disease.diseaseName}
                onChange={(e) => handleDiseaseChange(index, e.target.value)}
                placeholder="Disease Name"
              />
              <button type="button" onClick={() => handleRemoveDisease(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddDisease}>Add Disease</button>
        </div>
        {/* Appointments Section */}
        <div className="form-group">
          <label>Appointments:</label>
          {formData.appointments.map((appointment, index) => (
            <div key={index}>
              <input
                type="text"
                value={appointment}
                onChange={(e) => handleAppointmentChange(index, e.target.value)}
                placeholder="Appointment"
              />
              <button type="button" onClick={() => handleRemoveAppointment(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddAppointment}>Add Appointment</button>
        </div>
        <button className="submit-button" type="submit">Add eCard</button>
      </form>
    </div>
  );
};

export default AddECardForm;
