import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Notifications.css'; // Import your CSS file for styling

interface Appointment {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  __v: number;
}

const Notifications = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentView, setCurrentView] = useState('all');
  const [allRead, setAllRead] = useState(false);

  useEffect(() => {
    fetchNotifications(currentView);
  }, [currentView]);

  const fetchNotifications = async (type: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      let endpoint = '';
      switch (type) {
        case 'all':
          endpoint = '/notifications';
          break;
        case 'upcoming':
          endpoint = '/notifications/upcoming-appointments';
          break;
        case 'past':
          endpoint = '/notifications/past-appointments';
          break;
        default:
          return;
      }

      const response = await axios.get(`http://localhost:11003${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
      setAllRead(false);
    } catch (error) {
      console.error(`Error fetching ${type} appointments:`, error);
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

  const handleDeleteNotification = async (id: string) => {
    try {
      const token = sessionStorage.getItem('jwtToken');
      await axios.delete(`http://localhost:11003/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(appointments.filter(appointment => appointment._id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="notifications-container">
      <div className="buttons-group">
        <button className={`button ${currentView === 'all' ? 'active' : ''}`} onClick={() => setCurrentView('all')}>All Appointments</button>
        <button className={`button ${currentView === 'upcoming' ? 'active' : ''}`} onClick={() => setCurrentView('upcoming')}>Upcoming Appointments</button>
        <button className={`button ${currentView === 'past' ? 'active' : ''}`} onClick={() => setCurrentView('past')}>Past Appointments</button>
      </div>
      {appointments.length > 0 && !allRead && (
        <button className="button mark-read" onClick={markAllAsRead}>Mark All as Read</button>
      )}
      <ul className="appointments-list">
        {appointments.map((appointment, index) => (
          <li key={index} className="appointment-item">
            <strong>{appointment.title}</strong>: {appointment.message}
            <button className="delete-button" onClick={() => handleDeleteNotification(appointment._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
