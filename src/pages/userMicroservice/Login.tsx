import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; // Import your CSS file

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = !!sessionStorage.getItem('jwtToken');

    if (isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:11002/user/login',
        {
          username,
          password,
        }
      );

      console.log('Login success:', response.data.token);
      console.log(response.data)

      console.log(response.data.user.id)
      if(username == "Admin"){
        sessionStorage.setItem('Admin', "true");
      }
      sessionStorage.setItem('jwtToken', response.data.token);
      sessionStorage.setItem('id', response.data.user.id);

      window.location.reload();
      navigate('/');

    } catch (error) {
      console.error('Login error:', error);
      // Handle error: show message, set state, etc.
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="input-field"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" type="submit">Login</button>
      </form>
      <p className="credentials-note">Default credentials: username: testhash | pass: testhash</p>
    </div>
  );
};

export default LoginForm;
