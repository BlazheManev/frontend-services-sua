import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Disease {
  id: string;
  name: string;
  risk: boolean;
  description: string;
  symptoms: string[];
}

const DiseaseList: React.FC = () => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
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

    fetchData();
  }, [navigate]);

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
          </tr>
        </thead>
        <tbody>
          {diseases.map((disease) => (
            <tr key={disease.id}>
              <td>{disease.id}</td>
              <td>{disease.name}</td>
              <td>{disease.risk ? 'High' : 'Low'}</td>
              <td>{disease.description}</td>
              <td>{disease.symptoms.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiseaseList;
