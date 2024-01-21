import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Instructions from '../instructionMicroservice/InstructionsList';
import AddInstruction from '../instructionMicroservice/AddInstructionForm';
import { baseUrl } from '../../config';

interface Disease {
  id: string;
  name: string;
  risk: boolean;
  description: string;
  symptoms: string[];
}

const DiseaseList: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [editingDiseaseId, setEditingDiseaseId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Disease>({ id: '', name: '', risk: false, description: '', symptoms: [] });
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('Admin') === 'true'; // Check if the user is an admin
  const [activeView, setActiveView] = useState<'viewDiseases' | 'viewInstructions' | 'addInstruction'>('viewDiseases');

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');
    if (!isLoggedIn) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [navigate]);

  const getButtonStyle = (viewName: 'viewDiseases' | 'viewInstructions' | 'addInstruction') => {
    return activeView === viewName
      ? { backgroundColor: '#007bff', color: 'white' }
      : {};
  };
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }

        const response = await axios.get<Disease[]>(`${baseUrl}:11006/disease`, {

        headers: {
          Authorization: token,
        },
      });

      setDiseases(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEditClick = (disease: Disease) => {
    setEditingDiseaseId(disease.id);
    setEditFormData(disease);
  };
  const renderActionButtons = (disease: Disease) => {
    if (isAdmin) {
      return editingDiseaseId === disease.id ? (
        <>
          <Button variant="contained" color="primary" onClick={() => handleUpdate(disease.id)}>Save</Button>
          <Button variant="contained" color="secondary" onClick={() => setEditingDiseaseId(null)}>Cancel</Button>
        </>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEditClick(disease)}>Edit</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(disease.id)}>Delete</Button>
        </>
      );
    }
    return null;
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.put(`${baseUrl}:11006/disease/${id}`, editFormData, {
        headers: {
          Authorization: token,
        },
      });
      const updatedDiseases = diseases.map((d) => (d.id === id ? { ...d, ...editFormData } : d));
      setDiseases(updatedDiseases);
      setEditingDiseaseId(null);
    } catch (error) {
      console.error('Error updating disease:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.delete(`${baseUrl}:11006/disease/${id}`, {
        headers: {
          Authorization: token,
        },
      });
      const updatedDiseases = diseases.filter((d) => d.id !== id);
      setDiseases(updatedDiseases);
    } catch (error) {
      console.error('Error deleting disease:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  const handleRiskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, risk: e.target.checked });
  };

  return (
    <div className="termini-list-container">
       <div>
        <Button style={getButtonStyle('viewDiseases')} onClick={() => setActiveView('viewDiseases')}>View Diseases</Button>
        <Button style={getButtonStyle('viewInstructions')} onClick={() => setActiveView('viewInstructions')}>View Instructions</Button>
        <Button style={getButtonStyle('addInstruction')} onClick={() => setActiveView('addInstruction')}>Add Instruction</Button>
      </div>

      {activeView === 'viewDiseases' && (
          <>
              <h1>List of Diseases</h1>

       <table className="termini-table">
       <thead>
         <tr>
           <th>ID</th>
           <th>Name</th>
           <th>Risk</th>
           <th>Description</th>
           <th>Symptoms</th>
           {isAdmin && <th>Actions</th>}
         </tr>
       </thead>
       <tbody>
         {diseases.map((disease) => (
           <tr key={disease.id}>
             <td>{disease.id}</td>
             <td>
               {editingDiseaseId === disease.id ? (
                 <input type="text" value={editFormData.name} onChange={(e) => handleInputChange(e, 'name')} />
               ) : (
                 disease.name
               )}
             </td>
             <td>
               {editingDiseaseId === disease.id ? (
                 <input type="checkbox" checked={editFormData.risk} onChange={handleRiskChange} />
               ) : (
                 disease.risk ? 'High' : 'Low'
               )}
             </td>
             <td>
               {editingDiseaseId === disease.id ? (
                 <input type="text" value={editFormData.description} onChange={(e) => handleInputChange(e, 'description')} />
               ) : (
                 disease.description
               )}
             </td>
             <td>
               {editingDiseaseId === disease.id ? (
                 <input type="text" value={editFormData.symptoms.join(', ')} onChange={(e) => handleInputChange(e, 'symptoms')} />
               ) : (
                 disease.symptoms.join(', ')
               )}
             </td>
             <td>
             {renderActionButtons(disease)}
             </td>
           </tr>
         ))}
       </tbody>
     </table>
     </>
      )}

      {activeView === 'viewInstructions' && (
        <Instructions />
      )}

      {activeView === 'addInstruction' && (
        <AddInstruction />
      )}     
    </div>
  );
};

export default DiseaseList;
