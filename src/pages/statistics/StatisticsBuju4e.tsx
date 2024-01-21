import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

interface EndpointCallInfo {
  id: string;
  service: string;
  counter: number;
  last: boolean;
}

interface DataState {
  lastCalled: EndpointCallInfo | null;
  mostCalled: EndpointCallInfo | null;
  callsPerEndpoint: EndpointCallInfo[];
}

const StatisticsAPI: React.FC = () => {
  const [data, setData] = useState<DataState>({
    lastCalled: null,
    mostCalled: null,
    callsPerEndpoint: [],
  });
  const [activeView, setActiveView] = useState<'lastCalled' | 'mostCalled' | 'callsPerEndpoint'>('lastCalled');

  useEffect(() => {
    fetchData('mostCalled'); // Fetch initial data
  }, []);

  const fetchData = async (endpoint: 'mostCalled' | 'lastCalled' | 'counter') => {
    try {
      const response = await axios.get<EndpointCallInfo[]>(`https://statistics-dw7o.onrender.com/calls/${endpoint}`);
      if (endpoint === 'lastCalled') {
        setData((prevData) => ({ ...prevData, lastCalled: response.data[0] }));
      } else if (endpoint === 'mostCalled') {
        setData((prevData) => ({ ...prevData, mostCalled: response.data[0] }));
      } else if (endpoint === 'counter') {
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
      <h1>API Call Statistics</h1>
      <Button style={getViewButtonStyle('lastCalled')} onClick={() => { setActiveView('lastCalled'); fetchData('lastCalled'); }}>Last Called Endpoint</Button>
      <Button style={getViewButtonStyle('mostCalled')} onClick={() => { setActiveView('mostCalled'); fetchData('mostCalled'); }}>Most Called Endpoint</Button>
      <Button style={getViewButtonStyle('callsPerEndpoint')} onClick={() => { setActiveView('callsPerEndpoint'); fetchData('counter'); }}>Calls Per Endpoint</Button>

      <div style={{ marginTop: '20px' }}>
        {activeView === 'lastCalled' && (
          <div>
            <h2>Last Called Endpoint:</h2>
            <p>{data.lastCalled ? `${data.lastCalled.service} - Calls: ${data.lastCalled.counter}` : 'No data found'}</p>
          </div>
        )}

        {activeView === 'mostCalled' && (
          <div>
            <h2>Most Called Endpoint:</h2>
            <p>{data.mostCalled ? `${data.mostCalled.service} - Calls: ${data.mostCalled.counter}` : 'No data found'}</p>
          </div>
        )}

        {activeView === 'callsPerEndpoint' && (
          <div>
            <h2>Calls Per Endpoint:</h2>
            <ul>
              {data.callsPerEndpoint.map((item, index) => (
                <li key={index}>{item.service}: {item.counter}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsAPI;
