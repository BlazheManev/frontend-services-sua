import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

interface DiseaseSymptoms {
  temperature: boolean;
  bodyAches: boolean;
  nausea: boolean;
  vomiting: boolean;
  soreThroat: boolean;
  chestPain: boolean;
  rash: boolean;
  breathingDifficulty: boolean;
  backPain: boolean;
  headache: boolean;
  abdominalPain: boolean;
  faintness: boolean;
  fever: boolean;
  fatigue: boolean;
}

const DiseaseBySymptomsSearch: React.FC = () => {
  const [diseaseSymptoms, setDiseaseSymptoms] = useState<DiseaseSymptoms>({
    temperature: false,
    bodyAches: false,
    nausea: false,
    vomiting: false,
    soreThroat: false,
    chestPain: false,
    rash: false,
    breathingDifficulty: false,
    backPain: false,
    headache: false,
    abdominalPain: false,
    faintness: false,
    fever: false,
    fatigue: false
  });
  const [diseaseName, setDiseaseName] = useState('');
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem('jwtToken');

  const getDiseaseBySymptoms = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:11000/symptoms/disease', diseaseSymptoms, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDiseaseName(response.data.name);
    } catch (error) {
      console.error('Error fetching disease by symptoms:', error);
      setDiseaseName('');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDiseaseSymptoms({ ...diseaseSymptoms, [name]: checked });
  };

  return (
    <div className="search-container">
      <h2>Check Disease by Symptoms</h2>
      <div className="checkbox-container">
        {Object.keys(diseaseSymptoms).map((symptom) => (
          <label key={symptom}>
            <input
              type="checkbox"
              name={symptom}
              checked={diseaseSymptoms[symptom as keyof DiseaseSymptoms]}
              onChange={handleCheckboxChange}
            />
            {symptom.charAt(0).toUpperCase() + symptom.slice(1).replace(/([A-Z])/g, ' $1')}
          </label>
        ))}
      </div>
      <Button className="search-button" onClick={getDiseaseBySymptoms} disabled={loading}>
        Check Disease
      </Button>

      {loading && <p>Loading...</p>}
      <div className="search-results">
        <h3>Disease Result:</h3>
        <p>{diseaseName ? `Disease: ${diseaseName}` : 'No disease found based on symptoms.'}</p>
      </div>
    </div>
  );
};
export default DiseaseBySymptomsSearch;
