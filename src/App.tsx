import React from 'react';
import './styles/App.css';
import {Routes} from 'react-router-dom';     //TO JE NAMESTO SWITCH
import {Route} from 'react-router-dom';
import {Navigate} from 'react-router-dom';   //TO JE NAMESTO REDIRECT
import {BrowserRouter as Router} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import TerminiList from './pages/TerminiList';
import AddTerminForm from './pages/AddTerminForm';
import Navbar from './Navbar';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/RegisterForm';
import Home from './pages/Home';
import DiseaseList from './pages/DiseaseList';
import ECardList from './pages/ECardList';

function App() {
  return (
    <Router>
    
      <Helmet><title>SUA-Services</title></Helmet> 
      <div className = "App">
      <Navbar/>
        <Routes>

        <Route path="/" element={<Home></Home>} />

          <Route path="/TerminiList" element={<TerminiList></TerminiList>} />
          <Route path="/DiseaseList" element={<DiseaseList></DiseaseList>} />
          <Route path="/ECardList" element={<ECardList></ECardList>} />
          <Route path="/AddTerminForm" element={<AddTerminForm></AddTerminForm>} />
          <Route path="/Login" element={<LoginForm></LoginForm>} />
          <Route path="/Register" element={<RegistrationForm></RegistrationForm>} />

          <Route  path="*" element={<Navigate to="/404"/>} />


        </Routes>
      </div>
    </Router>

  );
}

export default App;
