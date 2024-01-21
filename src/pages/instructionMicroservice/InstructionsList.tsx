import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../config';

interface Instruction {
  id: string;
  diseaseId: string;
  instruction: string;
  medicines: string[];
  tips: string[];
}

const InstructionsList: React.FC = () => {
  const [instructions, setInstructions] = useState<Instruction[]>([]);
  const [editingInstructionId, setEditingInstructionId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Instruction>({ id: '', diseaseId: '', instruction: '', medicines: [], tips: [] });
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('Admin') === 'true';

  useEffect(() => {
    fetchInstructions();
  }, []);

  const fetchInstructions = async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }
      const response = await axios.get<Instruction[]>(`${baseUrl}:11007/instructions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInstructions(response.data);
    } catch (error) {
      console.error('Error fetching instructions:', error);
    }
  };

  const handleEditClick = (instruction: Instruction) => {
    setEditingInstructionId(instruction.id);
    setEditFormData(instruction);
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.put(`${baseUrl}:11007/instructions/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedInstructions = instructions.map((inst) => (inst.id === id ? { ...inst, ...editFormData } : inst));
      setInstructions(updatedInstructions);
      setEditingInstructionId(null);
    } catch (error) {
      console.error('Error updating instruction:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.delete(`${baseUrl}:11007/instructions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedInstructions = instructions.filter((inst) => inst.id !== id);
      setInstructions(updatedInstructions);
    } catch (error) {
      console.error('Error deleting instruction:', error);
    }
  };

  const renderActionButtons = (instruction: Instruction) => {
    if (isAdmin) {
      return editingInstructionId === instruction.id ? (
        <>
          <Button variant="contained" color="primary" onClick={() => handleUpdate(instruction.id)}>Save</Button>
          <Button variant="contained" color="secondary" onClick={() => setEditingInstructionId(null)}>Cancel</Button>
        </>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEditClick(instruction)}>Edit</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(instruction.id)}>Delete</Button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="termini-list-container">
      <h1>Instructions List</h1>
      <table className="termini-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Disease ID</th>
            <th>Instruction</th>
            <th>Medicines</th>
            <th>Tips</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {instructions.map((instruction) => (
            <tr key={instruction.id}>
              <td>{instruction.id}</td>
              <td>{instruction.diseaseId}</td>
              <td>{editingInstructionId === instruction.id ? <input type="text" value={editFormData.instruction} onChange={(e) => setEditFormData({ ...editFormData, instruction: e.target.value })} /> : instruction.instruction}</td>
              <td>{editingInstructionId === instruction.id ? <input type="text" value={editFormData.medicines.join(', ')} onChange={(e) => setEditFormData({ ...editFormData, medicines: e.target.value.split(', ') })} /> : instruction.medicines.join(', ')}</td>
              <td>{editingInstructionId === instruction.id ? <input type="text" value={editFormData.tips.join(', ')} onChange={(e) => setEditFormData({ ...editFormData, tips: e.target.value.split(', ') })} /> : instruction.tips.join(', ')}</td>
              <td>{renderActionButtons(instruction)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InstructionsList;
