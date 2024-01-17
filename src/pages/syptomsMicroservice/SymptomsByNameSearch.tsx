import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

interface Symptom {
  id: string;
  name: string;
  description: string;
  causes: string[];
}

const SymptomsByNameSearch: React.FC = () => {
  const [name, setName] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('jwtToken');

  const fetchSymptomsByName = async () => {
    if (!token) return;
    try {
      setLoading(true);

      const response = await axios.get(`http://localhost:11000/symptoms/name/${name}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data)) {
        setSymptoms(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setSymptoms([response.data]); // Wrap the object in an array
      } else {
        setSymptoms([]);
      }
    } catch (error) {
      console.error('Error fetching symptoms by name:', error);
      setSymptoms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Symptoms State:', symptoms);
  }, [symptoms]);

  return (
    <div className="search-container">
      <h2>Search Symptoms by Name</h2>
      <div>
        <input
          className="search-input"
          type="text"
          placeholder="Enter symptom name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="search-button" onClick={fetchSymptomsByName} disabled={loading}>
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
          <p>No symptoms found for this name.</p>
        )}
      </div>
    </div>
  );
};
export default SymptomsByNameSearch;
