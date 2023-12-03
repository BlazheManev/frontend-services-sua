// TerminiList.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Termin {
  id: string;
  patientId: string;
  dateTime: string; // Adjust date format as per backend response
  serviceType: string;
  doctor: string;
  specialRequests: string;
}

const TerminiList: React.FC = () => {
  const [termini, setTermini] = useState<Termin[]>([]);

  useEffect(() => {
    // Fetch data when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get<Termin[]>('http://localhost:11005/api/termini/all');
        setTermini(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once on component mount

  return (
    <div className="termini-list-container">
      <h1>List of Termini</h1>
      <table className="termini-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Patient ID</th>
            <th>Date Time</th>
            <th>Service Type</th>
            <th>Doctor</th>
            <th>Special Requests</th>
          </tr>
        </thead>
        <tbody>
          {termini.map((termin: Termin) => (
            <tr key={termin.id}>
              <td>{termin.id}</td>
              <td>{termin.patientId}</td>
              <td>{termin.dateTime}</td>
              <td>{termin.serviceType}</td>
              <td>{termin.doctor}</td>
              <td>{termin.specialRequests}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TerminiList;
