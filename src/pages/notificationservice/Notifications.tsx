// Notifications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [allRead, setAllRead] = useState(false);

  useEffect(() => {
    fetchUpcomingAppointments();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      console.log(token)

      const response = await axios.get('http://localhost:11003/notifications/upcoming-appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUpcomingAppointments(response.data);
      setAllRead(false);
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.put('http://localhost:11003/notifications/mark-read', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllRead(true);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchUpcomingAppointments}>Check Upcoming Appointments</button>
      {upcomingAppointments.length > 0 && !allRead && (
        <button onClick={markAllAsRead}>Mark All as Read</button>
      )}
      {/* Display upcoming appointments here */}
      <ul>
        {upcomingAppointments.map((appointment, index) => (
          <li key={index}>{appointment}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
