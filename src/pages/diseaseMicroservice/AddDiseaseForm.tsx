import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import '../../styles/AddTerminForm.css';

const AddDiseaseForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    risk: false,
    description: '',
    symptoms: ['']
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (field === 'risk') {
      setFormData({ ...formData, [field]: e.target.checked });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSymptomChange = (index: number, value: string) => {
    const updatedSymptoms = formData.symptoms.map((symptom, i) =>
      i === index ? value : symptom
    );
    setFormData({ ...formData, symptoms: updatedSymptoms });
  };

  const handleAddSymptom = () => {
    setFormData({
      ...formData,
      symptoms: [...formData.symptoms, '']
    });
  };

  const handleRemoveSymptom = (index: number) => {
    const updatedSymptoms = formData.symptoms.filter((_, i) => i !== index);
    setFormData({ ...formData, symptoms: updatedSymptoms });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.post('http://localhost:11006/disease', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Reset form or navigate away after successful post
      setFormData({ name: '', risk: false, description: '', symptoms: [''] });
    } catch (error) {
      console.error('Error creating disease:', error);
    }
  };

  return (
    <div className="add-termin-container">
      <h2>Add New Disease</h2>
      <form className="termin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={(e) => handleInputChange(e, 'name')} />
        </div>
        <div className="form-group">
          <label>Risk:</label>
          <input type="checkbox" name="risk" checked={formData.risk} onChange={(e) => handleInputChange(e, 'risk')} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input type="text" name="description" value={formData.description} onChange={(e) => handleInputChange(e, 'description')} />
        </div>
        <div className="form-group">
          <label>Symptoms:</label>
          {formData.symptoms.map((symptom, index) => (
            <div key={index}>
              <input type="text" value={symptom} onChange={(e) => handleSymptomChange(index, e.target.value)} />
              <button type="button" onClick={() => handleRemoveSymptom(index)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSymptom}>Add Symptom</button>
        </div>
        <button className="submit-button" type="submit">Add Disease</button>
      </form>
    </div>
  );
};

export default AddDiseaseForm;
