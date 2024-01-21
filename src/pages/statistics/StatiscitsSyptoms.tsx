import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

// Define the structure of the API call log data
interface EndpointCallInfo {
  _id: string;
  timestamp: string;
  endpoint: string;
  calls: number;
}

// Define the structure of the state that will hold the fetched data
interface DataState {
  lastCalled: EndpointCallInfo | null;
  mostCalled: EndpointCallInfo | null;
  callsPerEndpoint: EndpointCallInfo[];
}

const StatisticsSyptoms: React.FC = () => {
  const [data, setData] = useState<DataState>({ lastCalled: null, mostCalled: null, callsPerEndpoint: [] });
  const [activeView, setActiveView] = useState<'lastCalled' | 'mostCalled' | 'callsPerEndpoint'>('lastCalled');

  const fetchData = async (endpoint: 'lastCalledEndpoint' | 'mostCalled' | 'callsPerEndpoint') => {
    try {
      const response = await axios.get(`https://endpoints-service.onrender.com/${endpoint}`);
      if (endpoint === 'lastCalledEndpoint') {
        setData((prevData) => ({ ...prevData, lastCalled: response.data }));      
      } else if (endpoint === 'mostCalled') {
        setData((prevData) => ({ ...prevData, mostCalled: response.data }));
      } else if (endpoint === 'callsPerEndpoint') {
        setData((prevData) => ({ ...prevData, callsPerEndpoint: response.data }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getViewButtonStyle = (viewName: 'lastCalled' | 'mostCalled' | 'callsPerEndpoint') => {
    return activeView === viewName
      ? { backgroundColor: '#007bff', color: 'white' }
      : { backgroundColor: '#e7e7e7', color: 'black' };
  };

  return (
    <div>
      <h1>API Call Log Statistics</h1>
      <Button style={getViewButtonStyle('lastCalled')} onClick={() => { setActiveView('lastCalled'); fetchData('lastCalledEndpoint'); }}>Last Called Endpoint</Button>
      <Button style={getViewButtonStyle('mostCalled')} onClick={() => { setActiveView('mostCalled'); fetchData('mostCalled'); }}>Most Called Endpoint</Button>
      <Button style={getViewButtonStyle('callsPerEndpoint')} onClick={() => { setActiveView('callsPerEndpoint'); fetchData('callsPerEndpoint'); }}>Calls Per Endpoint</Button>

      <div style={{ marginTop: '20px' }}>
        {activeView === 'lastCalled' && (
          <div>
            <h2>Last Called Endpoint:</h2>
            <p>{data.lastCalled ? `${data.lastCalled.endpoint} - Calls: ${data.lastCalled.calls}` : 'No data found'}</p>
          </div>
        )}

        {activeView === 'mostCalled' && (
          <div>
            <h2>Most Frequent Endpoint:</h2>
            <p>{data.mostCalled ? `${data.mostCalled.endpoint} - Calls: ${data.mostCalled.calls}` : 'No data found'}</p>
          </div>
        )}

        {activeView === 'callsPerEndpoint' && (
          <div>
            <h2>Calls Per Endpoint:</h2>
            <ul>
              {data.callsPerEndpoint.map((item, index) => (
                <li key={index}>{item.endpoint}: {item.calls}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsSyptoms;
