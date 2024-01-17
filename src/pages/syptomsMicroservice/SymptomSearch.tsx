import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import '../../styles/Symptoms.css';

interface Symptom {
  id: string;
  name: string;
  description: string;
  causes: string[];
}

const SymptomsByCauseSearch: React.FC = () => {
  const [cause, setCause] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('jwtToken');

  const fetchSymptomsByCause = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get<Symptom[]>(`http://localhost:11000/symptoms/cause/${cause}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSymptoms(response.data);
    } catch (error) {
      console.error('Error fetching symptoms by cause:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Search Symptoms by Cause</h2>
      <div>
        <input
          className="search-input"
          type="text"
          placeholder="Enter cause"
          value={cause}
          onChange={(e) => setCause(e.target.value)}
        />
        
        <Button className="search-button" onClick={fetchSymptomsByCause} disabled={loading}>
          Search
        </Button>
      </div>
      {loading && <p>Loading...</p>}
      <div className="search-results">
        <h3>Search Results:</h3>
        {symptoms.length > 0 ? (
          <ul>
            {symptoms.map((symptom) => (
              <li key={symptom.id}>
                <strong>{symptom.name}</strong> - {symptom.description}
                <br />
                Causes: {symptom.causes.join(', ')}
              </li>
            ))}
          </ul>
        ) : (
          <p>No symptoms found for this cause.</p>
        )}
      </div>
    </div>
  );
};
export default SymptomsByCauseSearch;
