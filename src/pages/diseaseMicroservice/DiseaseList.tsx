import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

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

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');
    if (!isLoggedIn) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get<Disease[]>('http://localhost:11006/disease', {
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

  const handleUpdate = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.put(`http://localhost:11006/disease/${id}`, editFormData, {
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
      await axios.delete(`http://localhost:11006/disease/${id}`, {
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
      <h1>List of Diseases</h1>
      <table className="termini-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Risk</th>
            <th>Description</th>
            <th>Symptoms</th>
            <th>Actions</th>
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
                {editingDiseaseId === disease.id ? (
                  <>
                    <Button variant="contained" color="primary" onClick={() => handleUpdate(disease.id)}>Save</Button>
                    <Button variant="contained" color="secondary" onClick={() => setEditingDiseaseId(null)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" color="primary" onClick={() => handleEditClick(disease)}>Edit</Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(disease.id)}>Delete</Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiseaseList;
