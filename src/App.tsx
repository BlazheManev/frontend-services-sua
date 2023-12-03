import React from 'react';
import './App.css';
import {Routes} from 'react-router-dom';     //TO JE NAMESTO SWITCH
import {Route} from 'react-router-dom';
import {Navigate} from 'react-router-dom';   //TO JE NAMESTO REDIRECT
import {BrowserRouter as Router} from 'react-router-dom';
import {Helmet} from 'react-helmet';
import TerminiList from './pages/TerminiList';
import AddTerminForm from './pages/AddTerminForm';

function App() {
  return (
    <Router>
      <Helmet><title>SUA-Services</title></Helmet> 
      <div className = "App">
        <Routes>

          <Route path="/" element={<p>Osnovna stran</p>} />

          <Route path="/TerminiList" element={<TerminiList></TerminiList>} />
          <Route path="/AddTerminForm" element={<AddTerminForm></AddTerminForm>} />

          <Route  path="*" element={<Navigate to="/404"/>} />


        </Routes>
      </div>
    </Router>

  );
}

export default App;
