import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import SymptomSearchByCause from './SymptomSearch';
import SymptomSearchByName from './SymptomsByNameSearch';
import DiseaseBySymptomsSearch from './DiseaseBySymptomsSearch';
import AddSymptom from './AddSymptom';

interface Symptom {
  id: string;
  name: string;
  description: string;
  causes: string[];
}

const SymptomList: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [editingSymptomId, setEditingSymptomId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '', causes: [''] });
  const navigate = useNavigate();
  const isAdmin = sessionStorage.getItem('Admin') === 'true'; // Check if the user is an admin
  const [activeComponent, setActiveComponent] = useState('symptomList'); // New state to track the active component

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'symptomByCause':
        return <SymptomSearchByCause />;
      case 'symptomByName':
        return <SymptomSearchByName />;
      case 'diseaseBySymptoms':
        return <DiseaseBySymptomsSearch />;
      case 'AddSymptom':
        return <AddSymptom />;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          navigate('/');
          return;
        }
        const response = await axios.get<Symptom[]>('http://localhost:11000/symptoms', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSymptoms(response.data);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      }
    };
    fetchData();
  }, [navigate]);

  const handleEditClick = (symptom: Symptom) => {
    setEditingSymptomId(symptom.id);
    setEditFormData({ ...symptom });
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }
      await axios.put(`http://localhost:11000/symptoms/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedSymptoms = symptoms.map((symptom) =>
        symptom.id === id ? { ...symptom, ...editFormData } : symptom
      );
      setSymptoms(updatedSymptoms);
      console.log(updatedSymptoms)
      setEditingSymptomId(null);
    } catch (error) {
      console.error('Error updating symptom:', error);
    }
  };

  const getButtonStyle = (componentName: string) => {
    return componentName === activeComponent ? { backgroundColor: 'Orange' } : {};
  };
  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }
      await axios.delete(`http://localhost:11000/symptoms/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSymptoms(symptoms.filter(symptom => symptom.id !== id));
    } catch (error) {
      console.error('Error deleting symptom:', error);
    }
  };

  // Function to handle changes to causes and other inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => {
    if (typeof index === 'number') {
      const updatedCauses = editFormData.causes.map((cause, i) => i === index ? e.target.value : cause);
      setEditFormData({ ...editFormData, causes: updatedCauses });
    } else {
      setEditFormData({ ...editFormData, [field]: e.target.value });
    }
  };

  const handleAddCause = () => {
    setEditFormData({ ...editFormData, causes: [...editFormData.causes, ''] });
  };

  const handleRemoveCause = (index: number) => {
    const updatedCauses = editFormData.causes.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, causes: updatedCauses });
  };

  return (
    <div className="termini-list-container">
      <h1>List of Symptoms</h1>
      <table className="termini-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Causes</th>
            {isAdmin && (
   <th>Actions</th> )}
          </tr>
        </thead>
        <tbody>
          {symptoms.map((symptom) => (
            <tr key={symptom.id}>
              <td>
                {editingSymptomId === symptom.id ? (
                  <input 
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                  />
                ) : symptom.name}
              </td>
              <td>
                {editingSymptomId === symptom.id ? (
                  <input 
                    type="text"
                    value={editFormData.description}
                    onChange={(e) => handleInputChange(e, 'description')}
                  />
                ) : symptom.description}
              </td>
              <td>
                {editingSymptomId === symptom.id ? (
                  editFormData.causes.map((cause, index) => (
                    <div key={index}>
                      <input 
                        type="text"
                        value={cause}
                        onChange={(e) => handleInputChange(e, 'causes', index)}
                      />
                      <button type="button" onClick={() => handleRemoveCause(index)}>Remove</button>
                    </div>
                  ))
                ) : (
                  symptom.causes.join(', ')
                )}
                {editingSymptomId === symptom.id && (
                  <button type="button" onClick={handleAddCause}>Add Cause</button>
                )}
              </td>
              {isAdmin && (
                <td>
                  {editingSymptomId === symptom.id ? (
                    <Button variant="contained" color="primary" onClick={() => handleUpdate(symptom.id)}>Save</Button>
                  ) : (
                    <>
                      <Button variant="contained" color="primary" style={{ marginRight: '10px' }} onClick={() => handleEditClick(symptom)}>Edit</Button>
                      <Button variant="contained" color="error" onClick={() => handleDelete(symptom.id)}>Delete</Button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <br></br>
      <div>
        <Button style={getButtonStyle('symptomByCause')} onClick={() => setActiveComponent('symptomByCause')}>
          Search by Cause
        </Button>
        <Button style={getButtonStyle('symptomByName')} onClick={() => setActiveComponent('symptomByName')}>
          Search by Name
        </Button>
        <Button style={getButtonStyle('diseaseBySymptoms')} onClick={() => setActiveComponent('diseaseBySymptoms')}>
          Check Disease by Symptoms
        </Button>
        <Button style={getButtonStyle('AddSymptom')} onClick={() => setActiveComponent('AddSymptom')}>
        add Symptom
        </Button>
      </div>
      {renderActiveComponent()}

    </div>
  );
};

export default SymptomList;
