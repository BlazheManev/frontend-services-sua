import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

interface Termin {
  id: string;
  patientId: string;
  dateTime: string;
  serviceType: string;
  doctor: string;
  specialRequests: string;
}

const TerminiList: React.FC = () => {
  const [termini, setTermini] = useState<Termin[]>([]);
  const [editingTerminId, setEditingTerminId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Termin>({ id: '', patientId: '', dateTime: '', serviceType: '', doctor: '', specialRequests: '' });
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'past' | 'future'>('all');
  const isAdmin = sessionStorage.getItem('Admin') === 'true'; // Check if the user is an admin

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');
    if (!isLoggedIn) {
      navigate('/');
    } else {
      fetchTermini(activeFilter);
    }
  }, [activeFilter]);

  const renderActionButtons = (termin: Termin) => {
    if (isAdmin) {
      return editingTerminId === termin.id ? (
        <>
          <Button variant="contained" color="primary" onClick={() => handleUpdate(termin.id)}>Save</Button>
          <Button variant="contained" color="secondary" onClick={() => setEditingTerminId(null)}>Cancel</Button>
        </>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={() => handleEditClick(termin)}>Edit</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(termin.id)}>Delete</Button>
        </>
      );
    }
    return null;
  };
  const fetchTermini = async (filter: 'all' | 'past' | 'future') => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      if (!token) {
        navigate('/');
        return;
      }
      const endpoint = filter === 'all' ? 'all' : filter === 'past' ? 'past' : 'future';
      const response = await axios.get<Termin[]>(`http://localhost:11005/api/termini/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTermini(response.data);
    } catch (error) {
      console.error(`Error fetching ${filter} termini:`, error);
    }
  };

  const getButtonStyle = (filterName: 'all' | 'past' | 'future') => {
    return activeFilter === filterName
      ? { backgroundColor: '#007bff', color: 'white' }
      : {};
  };

  const handleEditClick = (termin: Termin) => {
    setEditingTerminId(termin.id);
    setEditFormData(termin);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setEditFormData({ ...editFormData, [field]: e.target.value });
  };

  const handleUpdate = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.put(`http://localhost:11005/api/termini/update/${id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTermini = termini.map((termin) => termin.id === id ? { ...termin, ...editFormData } : termin);
      setTermini(updatedTermini);
      setEditingTerminId(null);
    } catch (error) {
      console.error('Error updating termin:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:11005/api/termini/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTermini(termini.filter((termin) => termin.id !== id));
    } catch (error) {
      console.error('Error deleting termin:', error);
    }
  };

  return (
  
    <div className="termini-list-container">
      <h1>List of Termini</h1>
      <div>
        <Button style={getButtonStyle('all')} onClick={() => setActiveFilter('all')}>
          All Termini
        </Button>
        <Button style={getButtonStyle('past')} onClick={() => setActiveFilter('past')}>
          Past Termini
        </Button>
        <Button style={getButtonStyle('future')} onClick={() => setActiveFilter('future')}>
          Future Termini
        </Button>
      </div>
      <table className="termini-table">
        <thead>
          <tr>
            <th>Patient name</th>
            <th>Date Time</th>
            <th>Service Type</th>
            <th>Doctor</th>
            <th>Special Requests</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {termini.map((termin) => (
            <tr key={termin.id}>
              <td>
                {editingTerminId === termin.id ? (
                  <input 
                    type="text"
                    value={editFormData.patientId}
                    onChange={(e) => handleInputChange(e, 'patientId')}
                  />
                ) : termin.patientId}
              </td>
              <td>
                {editingTerminId === termin.id ? (
                  <input 
                    type="text"
                    value={editFormData.dateTime}
                    onChange={(e) => handleInputChange(e, 'dateTime')}
                  />
                ) : termin.dateTime}
              </td>
              <td>
                {editingTerminId === termin.id ? (
                  <input 
                    type="text"
                    value={editFormData.serviceType}
                    onChange={(e) => handleInputChange(e, 'serviceType')}
                  />
                ) : termin.serviceType}
              </td>
              <td>
                {editingTerminId === termin.id ? (
                  <input 
                    type="text"
                    value={editFormData.doctor}
                    onChange={(e) => handleInputChange(e, 'doctor')}
                  />
                ) : termin.doctor}
              </td>
              <td>
                {editingTerminId === termin.id ? (
                  <input 
                    type="text"
                    value={editFormData.specialRequests}
                    onChange={(e) => handleInputChange(e, 'specialRequests')}
                  />
                ) : termin.specialRequests}
              </td>
              <td>
                {renderActionButtons(termin)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TerminiList;
