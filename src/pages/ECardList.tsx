import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface eCard {
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
  const [eCards, setECards] = useState<eCard[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          navigate('/');
          return;
        }
        const response = await axios.get<eCard[]>('http://localhost:11001/eCard', {
          headers: {
            Authorization: `${token}` // Set the token in the Authorization header
          }
        });
        setECards(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [navigate]);

  return (
    <div className="termini-list-container">
      <h1>List of eCards</h1>
      <table className="termini-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Date of Birth</th>
            <th>Weight</th>
            <th>Height</th>
            <th>Blood Type</th>
            <th>Diseases</th>
            <th>Appointments</th>
          </tr>
        </thead>
        <tbody>
          {eCards.map((card) => (
            <tr key={card.id}>
              <td>{card.id}</td>
              <td>{card.userId}</td>
              <td>{card.dateOfBirth}</td>
              <td>{card.weight}</td>
              <td>{card.height}</td>
              <td>{card.bloodType || 'N/A'}</td>
              <td>{card.diseases.map(disease => disease.diseaseName).join(', ')}</td>
              <td>{card.appointments.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ECardList;
