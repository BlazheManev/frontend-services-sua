import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface ECard {
  id: string;
  userId: string | null;
  dateOfBirth: string;
  weight: number;
  height: number;
  bloodType: string | null;
  diseases: { diseaseName: string }[];
  appointments: string[];
}

const ECardList: React.FC = () => {
  const [eCards, setECards] = useState<ECard[]>([]);
  const [editingECardId, setEditingECardId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ weight: 0, height: 0, bloodType: '', diseases: [] as { diseaseName: string }[] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }
      try {
        const response = await axios.get<ECard[]>('http://localhost:11001/eCard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setECards(response.data);
      } catch (error) {
        console.error('Error fetching eCards:', error);
      }
    };
    fetchData();
  }, [navigate]);

  const handleEditClick = (card: ECard) => {
    setEditingECardId(card.id);
    setEditFormData({ 
      weight: card.weight, 
      height: card.height, 
      bloodType: card.bloodType || '',
      diseases: card.diseases,
    });
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }
      await axios.put(`http://localhost:11001/eCard/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedECards = eCards.map((card) =>
        card.id === id ? { ...card, ...editFormData } : card
      );
      setECards(updatedECards);
      setEditingECardId(null);
    } catch (error) {
      console.error('Error updating eCard:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }
      await axios.delete(`http://localhost:11001/eCard/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setECards(eCards.filter(card => card.id !== id));
    } catch (error) {
      console.error('Error deleting eCard:', error);
    }
  };

  const handleDiseaseChange = (index: number, value: string) => {
    const updatedDiseases = editFormData.diseases.map((disease, i) => 
      i === index ? { diseaseName: value } : disease
    );
    setEditFormData({ ...editFormData, diseases: updatedDiseases });
  };
  const navigateToDiseaseList = () => {
    navigate('/DiseaseList');
  };

  return (
    <div className="termini-list-container">
      <h1>List of eCards</h1>
      <table className="termini-table table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Weight</th>
            <th>Height</th>
            <th>Blood Type</th>
            <th>Diseases</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {eCards.map((card) => (
            <tr key={card.id}>
              <td>{card.userId}</td>
              <td>{card.dateOfBirth}</td>
              <td>
                {editingECardId === card.id ? (
                  <input 
                    type="number"
                    placeholder="Weight"
                    value={editFormData.weight}
                    onChange={(e) => setEditFormData({ ...editFormData, weight: +e.target.value })}
                  />
                ) : card.weight}
              </td>
              <td>
                {editingECardId === card.id ? (
                  <input 
                    type="number"
                    placeholder="Height"
                    value={editFormData.height}
                    onChange={(e) => setEditFormData({ ...editFormData, height: +e.target.value })}
                  />
                ) : card.height}
              </td>
              <td>
                {editingECardId === card.id ? (
                  <input 
                    type="text"
                    placeholder="Blood Type"
                    value={editFormData.bloodType}
                    onChange={(e) => setEditFormData({ ...editFormData, bloodType: e.target.value })}
                  />
                ) : card.bloodType || 'N/A'}
              </td>
              <td onClick={navigateToDiseaseList} style={{ cursor: 'pointer' }}>
                {editingECardId === card.id ? (
                  editFormData.diseases.map((disease, index) => (
                    <input 
                      key={index}
                      type="text"
                      value={disease.diseaseName}
                      onChange={(e) => handleDiseaseChange(index, e.target.value)}
                    />
                  ))
                ) : (
                  card.diseases.map(disease => disease.diseaseName).join(', ')
                )}
              </td>
              <td>
                {editingECardId === card.id ? (
                  <Button variant="contained" color="primary" onClick={() => handleUpdate(card.id)}>Save</Button>
                ) : (
                  <>
                    <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => handleEditClick(card)}>Edit</Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(card.id)}>Delete</Button>
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

export default ECardList;
