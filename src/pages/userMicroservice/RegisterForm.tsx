import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; 

const RegistrationForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    // Basic validation
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    // Reset error message
    setErrorMessage('');
    if (username.length < 5) {
      setErrorMessage('Username must be at least 5 characters long.');
      return;
    }
    try {
      // Send POST request to create a new user
      await axios.post('http://localhost:11002/user', {
        username,
        email,
        password,
      });

      // Redirect or show success message
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Failed to register. Please try again.');
    }
  };

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');
    if (isLoggedIn) {
      navigate('/'); // Redirect to home if already logged in
    }
  }, [navigate]);

  return (
    <div className="login-container">
      <h2>Registration</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form className="login-form" onSubmit={handleRegister}>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="login-button" type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
