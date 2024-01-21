import React, { useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

interface DiseaseSymptoms {
  temperature: number; // Changed to a number
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
    temperature: 30, // Default temperature value is 30
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
    fatigue: false,
  });
  const [diseaseName, setDiseaseName] = useState("");
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("jwtToken");

  const getDiseaseBySymptoms = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:11000/symptoms/disease",
        diseaseSymptoms,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDiseaseName(response.data.name);
    } catch (error) {
      console.error("Error fetching disease by symptoms:", error);
      setDiseaseName("");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setDiseaseSymptoms({
      ...diseaseSymptoms,
      [name]: name === "temperature" ? parseInt(value) : checked,
    });
  };

  return (
    <div className="search-container">
      <h2>Check Disease by Symptoms</h2>
      <div className="checkbox-container">
        {Object.keys(diseaseSymptoms).map((symptom) => (
          <label key={symptom}>
            <input
              type={symptom === "temperature" ? "number" : "checkbox"} // Use 'number' for temperature
              name={symptom}
              checked={
                symptom === "temperature"
                  ? undefined
                  : (diseaseSymptoms[
                      symptom as keyof DiseaseSymptoms
                    ] as boolean)
              }
              value={
                symptom === "temperature"
                  ? diseaseSymptoms.temperature
                  : undefined
              }
              min={symptom === "temperature" ? 30 : undefined} // Min value for temperature
              max={symptom === "temperature" ? 40 : undefined} // Max value for temperature
              onChange={handleCheckboxChange}
            />
            {symptom.charAt(0).toUpperCase() +
              symptom.slice(1).replace(/([A-Z])/g, " $1")}
          </label>
        ))}
      </div>
      <Button
        className="search-button"
        onClick={getDiseaseBySymptoms}
        disabled={loading}
      >
        Check Disease
      </Button>

      {loading && <p>Loading...</p>}
      <div className="search-results">
        <h3>Disease Result:</h3>
        <p>
          {diseaseName
            ? `Disease: ${diseaseName}`
            : "No disease found based on symptoms."}
        </p>
      </div>
    </div>
  );
};
export default DiseaseBySymptomsSearch;
