import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

// Define the structure of the API call log data
interface ApiCallLog {
  _id?: string;
  endpoint?: string;
  count?: number;
}


// Define the structure of the state that will hold the fetched data
interface DataState {
  lastCalled: ApiCallLog | null;
  mostFrequent: string | null;
  callsPerEndpoint: ApiCallLog[];
}

const StatisticsTermini: React.FC = () => {
  const [data, setData] = useState<DataState>({ lastCalled: null, mostFrequent: null, callsPerEndpoint: [] });
  const [activeView, setActiveView] = useState<'lastCalled' | 'mostFrequent' | 'callsPerEndpoint'>('lastCalled');

  const fetchData = async (endpoint: 'lastCalledEndpoint' | 'mostCalled' | 'callsPerEndpoint') => {
    try {
      const response = await axios.get(`https://blazhe-statistika.onrender.com/${endpoint}`);
      if (endpoint === 'lastCalledEndpoint') {
        setData((prevData) => ({ ...prevData, lastCalled: response.data }));      
      } else if (endpoint === 'mostCalled') {
        setData((prevData) => ({ ...prevData, mostFrequent: response.data }));
      } else if (endpoint === 'callsPerEndpoint') {
        console.log(response.data)
        setData((prevData) => ({ ...prevData, callsPerEndpoint: response.data }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const getViewButtonStyle = (viewName: 'lastCalled' | 'mostFrequent' | 'callsPerEndpoint') => {
    return activeView === viewName
      ? { backgroundColor: '#007bff', color: 'white' }
      : { backgroundColor: '#e7e7e7', color: 'black' };
  };

  return (
    <div>
      <h1>API Call Log Statistics</h1>
      <Button  style={getViewButtonStyle('lastCalled')} onClick={() => { setActiveView('lastCalled'); fetchData('lastCalledEndpoint'); }}>Last Called Endpoint</Button>
      <Button style={getViewButtonStyle('mostFrequent')} onClick={() => { setActiveView('mostFrequent'); fetchData('mostCalled'); }}>Most Frequent Endpoint</Button>
      <Button style={getViewButtonStyle('callsPerEndpoint')} onClick={() => { setActiveView('callsPerEndpoint'); fetchData('callsPerEndpoint'); }}>Calls Per Endpoint</Button>

      <div style={{ marginTop: '20px' }}>
      {activeView === 'lastCalled' && (
  <div>
    <h2>Last Called Endpoint:</h2>
    <p>{data.lastCalled ? data.lastCalled.endpoint : 'No data found'}</p>
  </div>
)}

        {activeView === 'mostFrequent' && (
          <div>
            <h2>Most Frequent Endpoint:</h2>
            <p>{data.mostFrequent || 'No data found'}</p>
            
          </div>
        )}

        {activeView === 'callsPerEndpoint' && (
          <div>
            <h2>Calls Per Endpoint:</h2>
            <ul>
              {data.callsPerEndpoint.map((item, index) => (
                <li key={index}>{item._id}: {item.count}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsTermini;
