import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import '../../styles/AddTerminForm.css';

interface SymptomCause {
  cause: string;
}

const AddSymptomForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    causes: [{ cause: '' }],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    if (typeof index === 'number') {
      const updatedCauses = formData.causes.map((item, i) => 
        i === index ? { cause: e.target.value } : item
      );
      setFormData({ ...formData, causes: updatedCauses });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleAddCause = () => {
    setFormData({
      ...formData,
      causes: [...formData.causes, { cause: '' }],
    });
  };

  const handleRemoveCause = (index: number) => {
    const updatedCauses = formData.causes.filter((_, i) => i !== index);
    setFormData({ ...formData, causes: updatedCauses });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      const symptomData = {
        ...formData,
        causes: formData.causes.map(item => item.cause),
      };
      await axios.post('http://localhost:11000/symptoms', symptomData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Reset form or handle success
    } catch (error) {
      console.error('Error creating symptom:', error);
    }
  };

  return (
    <div className="add-ecard-container">
      <h2>Add New Symptom</h2>
      <form className="termin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange(e, 'name')}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={(e) => handleInputChange(e, 'description')}
          />
        </div>
        <div className="form-group">
          <label>Causes:</label>
          {formData.causes.map((cause, index) => (
            <div key={index}>
              <input
                type="text"
                value={cause.cause}
                onChange={(e) => handleInputChange(e, 'causes', index)}
              />
                        <br></br>
                        <br></br>
             <Button variant="contained" color="error" onClick={() => handleRemoveCause(index)}>Remove</Button>
            </div>
          ))}
          <br></br>
             <Button variant="contained" color="primary"  onClick={handleAddCause}>Add Cause</Button>
        </div>
        <Button variant="contained" color="primary" type="submit">Add Symptom</Button>
      </form>
    </div>
  );
};

export default AddSymptomForm;
