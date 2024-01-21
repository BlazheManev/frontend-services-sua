import React, { useState } from 'react';
import StatisticsTermini from './StatisticsTermini';
import StatisticsUser from './StatisticsUser';
import StatisticsSymptoms from './StatiscitsSyptoms';
import Button from '@mui/material/Button';

const Statistics: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<'Termini' | 'User' | 'Symptoms'>('Termini');

  const getButtonStyle = (componentName: 'Termini' | 'User' | 'Symptoms') => {
    return activeComponent === componentName
      ? { backgroundColor: '#007bff', color: 'white' }
      : { backgroundColor: '#e7e7e7', color: 'black' };
  };

  return (
    <div>
      <h1>API Call Log Statistics</h1>
      <Button style={getButtonStyle('Termini')} onClick={() => setActiveComponent('Termini')}>Termini Statistics</Button>
      <Button style={getButtonStyle('User')} onClick={() => setActiveComponent('User')}>User Statistics</Button>
      <Button style={getButtonStyle('Symptoms')} onClick={() => setActiveComponent('Symptoms')}>Symptoms Statistics</Button>

      <div style={{ marginTop: '20px' }}>
        {activeComponent === 'Termini' && <StatisticsTermini />}
        {activeComponent === 'User' && <StatisticsUser />}
        {activeComponent === 'Symptoms' && <StatisticsSymptoms />}
      </div>
    </div>
  );
};

export default Statistics;
