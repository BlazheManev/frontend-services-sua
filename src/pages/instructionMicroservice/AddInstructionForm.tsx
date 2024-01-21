// src/pages/instructionMicroservice/AddInstructionForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { baseUrl } from '../../config';

interface AddInstructionFormProps {
  diseaseId?: string; // Making diseaseId optional
}

const AddInstructionForm: React.FC<AddInstructionFormProps> = ({ diseaseId = '' }) => {
  const [instructionData, setInstructionData] = useState({
    diseaseId,
    instruction: '',
    medicines: [],
    tips: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstructionData({ ...instructionData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setInstructionData({ ...instructionData, [field]: e.target.value.split(', ') });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.post(`${baseUrl}:11007/instructions`, instructionData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Handle success (e.g., showing a success message or redirecting)
    } catch (error) {
      console.error('Error adding instruction:', error);
    }
  };

  return (
    <div className="add-instruction-container">
      <h2>Add New Instruction</h2>
      <form className="instruction-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="instruction"
          placeholder="Instruction"
          value={instructionData.instruction}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="medicines"
          placeholder="Medicines (comma separated)"
          value={instructionData.medicines.join(', ')}
          onChange={(e) => handleArrayChange(e, 'medicines')}
        />
        <input
          type="text"
          name="tips"
          placeholder="Tips (comma separated)"
          value={instructionData.tips.join(', ')}
          onChange={(e) => handleArrayChange(e, 'tips')}
        />
        <Button type="submit">Add New Instruction</Button>
      </form>
    </div>
  );
};

export default AddInstructionForm;
