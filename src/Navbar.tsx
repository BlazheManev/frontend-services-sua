import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const isLoggedIn = !!sessionStorage.getItem('jwtToken'); // Check if user is logged in
  const navigate = useNavigate();
  console.log(isLoggedIn);

  const handleLogout = () => {
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('Admin');
    sessionStorage.removeItem('id');

    navigate('/'); // Redirect to home after logout
    window.location.reload();

  };

  const handleLoginClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        {isLoggedIn && (
          <>
            <li className="nav-item">
              <Link to="/TerminiList" className="nav-link">
                Termin List
              </Link>
            </li>
            
            <li className="nav-item">
              <Link to="/DiseaseList" className="nav-link">
                Disease List
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/ECardList" className="nav-link">
                E-Card List
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/AddTerminForm" className="nav-link">
                Add Termin
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/ResetPass" className="nav-link">
                Forgot Password
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/SymptomList" className="nav-link">
                List of Syptoms
              </Link>
            </li>
          

            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </>
        )}
        {!isLoggedIn && (
          <li className="nav-item">
            <Link to="/Login" className="nav-link" onClick={handleLoginClick}>
              Login
            </Link>
          </li>
        )}
         {!isLoggedIn && (
          <li className="nav-item">
            <Link to="/Register" className="nav-link" onClick={handleLoginClick}>
              Register
            </Link>
          </li>
          
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
