import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css'; 

function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/TerminiList" className="nav-link">Termin List</Link>
        </li>
        <li className="nav-item">
          <Link to="/AddTerminForm" className="nav-link">Add Termin</Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
