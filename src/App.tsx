import React from 'react';
import './styles/App.css';
import { Routes, Route, Navigate, BrowserRouter as Router } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import TerminiList from './pages/terminiMicroservice/TerminiList';
import AddTerminForm from './pages/terminiMicroservice/AddTerminForm';
import Navbar from './Navbar';
import NavbarAdmin from './NavbarAdmin';
import LoginForm from './pages/userMicroservice/Login';
import RegistrationForm from './pages/userMicroservice/RegisterForm';
import Home from './pages/Home';
import DiseaseList from './pages/DiseaseList';
import ECardList from './pages/eCardMicroservice/ECardList';
import ResetPass from './pages/userMicroservice/ResetPassword';
import AllUsers from './pages/userMicroservice/AllUsers';
import AddCard from './pages/eCardMicroservice/AddECardForm';
import SymptomList from './pages/syptomsMicroservice/SymptomList';
import Notifications from './pages/notificationservice/Notifications';

function App() {
  const isAdmin = sessionStorage.getItem('Admin') === 'true'; // Check if the user is an admin

  return (
    <Router>
      <Helmet><title>SUA-Services</title></Helmet> 
      <div className="App">
        {isAdmin ? <NavbarAdmin /> : <Navbar />} 

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/TerminiList" element={<TerminiList />} />
          <Route path="/DiseaseList" element={<DiseaseList />} />
          <Route path="/ECardList" element={<ECardList />} />
          <Route path="/AddTerminForm" element={<AddTerminForm />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/Register" element={<RegistrationForm />} />
          <Route path="/ResetPass" element={<ResetPass />} />
          <Route path="/SymptomList" element={<SymptomList />} />
          <Route path="/Notifications" element={<Notifications />} />

          {/* Admin-only route */}
          {isAdmin == true && <Route path="/AllUsers" element={<AllUsers />} />}
          {isAdmin == true && <Route path="/AddCard" element={<AddCard />} />}

          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
