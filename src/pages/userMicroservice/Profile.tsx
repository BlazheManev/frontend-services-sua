import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/UserCardAndAppointments.css';
import Button from '@mui/material/Button';
import { baseUrl } from '../../config';

const UserCardAndAppointments: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const userId = sessionStorage.getItem('id');
  const authToken = sessionStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${baseUrl}:11002/user/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);

        if (response.data.card && response.data.card.appointments) {
          const fetchedAppointments = await Promise.all(response.data.card.appointments.map(async (appointmentId: string) => {
            const appointmentResponse = await axios.get(`${baseUrl}:11005/api/termini/${appointmentId}`, {
              headers: { Authorization: `Bearer ${authToken}` },
            });
            return appointmentResponse.data;
          }));
          setAppointments(fetchedAppointments);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, authToken]);

  return (
    <div className="user-card-container">
       <Button variant="contained" color="error" onClick={() => navigate('/ResetPass')}>Forgot Passowrd</Button>
       
       <Button variant="contained" color="success" onClick={() => navigate('/Notifications')}>Notifications</Button>

      <h2>User Data and Appointments</h2>
      {userData ? (
        <div className="user-details">
          <h3>User Details</h3>
          <p><strong>Username:</strong> {userData.user.username}</p>
          <p><strong>Email:</strong> {userData.user.email}</p>
          <p><strong>Admin Status:</strong> {userData.user.isAdmin ? 'Yes' : 'No'}</p>
  
          {userData.card.id != null ? (
            <div>
              <h4>Card Details</h4>
              <p><strong>Card ID:</strong> {userData.card.id}</p>
              <p><strong>Date of Birth:</strong> {userData.card.dateOfBirth}</p>
              <p><strong>Weight:</strong> {userData.card.weight}</p>
              <p><strong>Height:</strong> {userData.card.height}</p>
              <p><strong>Blood Type:</strong> {userData.card.bloodType}</p>
              <p><strong>Diseases:</strong> {userData.card.diseases && userData.card.diseases.length > 0 ? userData.card.diseases.map((disease: any) => disease.diseaseName).join(', ') : 'None'}</p>
            </div>
          ) : (
            <div>
              <p>No card added.</p>
              <Button variant="contained" color="success" onClick={() => navigate('/addCard')}>Add Card</Button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}

      <div className="appointments">
        <h3>Appointments</h3>
        {appointments.length > 0 ? (
          <table className="termini-table">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th>Doctor</th>
                <th>Service Type</th>
                <th>Special Requests</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => {
                if (appointment) {
                  return (
                    <tr key={index}>
                      <td>{appointment.dateTime}</td>
                      <td>{appointment.doctor}</td>
                      <td>{appointment.serviceType}</td>
                      <td>{appointment.specialRequests}</td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={index}>
                      <td colSpan={4}>Appointments</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        ) : <p>No appointments found.</p>}
      </div>
    </div>
  );
};

export default UserCardAndAppointments;
