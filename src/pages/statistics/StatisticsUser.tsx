import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';

interface LastCalledEndpoint {
    endpoint: string;
    timestamp: string;
  }
  
  interface MostCalledEndpoint {
    mostCalledEndpoint: {
      _id: string;
      count: number;
    };
    totalCalls: number;
  }

  
  interface CallsPerEndpoint {
    callsPerEndpoint: Array<{
      endpoint: string;
      count: number;
    }>;
    totalEndpoints: number;
  }
  
  interface DataState {
    lastCalled: LastCalledEndpoint | null;
    mostFrequent: MostCalledEndpoint | null;
    callsPerEndpoint: CallsPerEndpoint | null;
  }
  
const StatisticsUser: React.FC = () => {
  const [data, setData] = useState<DataState>({
    lastCalled: null,
    mostFrequent: null,
    callsPerEndpoint: null,
  });
  const [activeView, setActiveView] = useState<'lastCalled' | 'mostFrequent' | 'callsPerEndpoint'>('lastCalled');
  const getViewButtonStyle = (viewName: 'lastCalled' | 'mostFrequent' | 'callsPerEndpoint') => {
    return activeView === viewName
      ? { backgroundColor: '#007bff', color: 'white' }
      : { backgroundColor: '#e7e7e7', color: 'black' };
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lastCalledRes, mostFrequentRes, callsPerEndpointRes] = await Promise.all([
          axios.get<LastCalledEndpoint>('https://statistics-service1.onrender.com/lastCalledEndpoint'),
          axios.get<MostCalledEndpoint>('https://statistics-service1.onrender.com/mostCalled'),
          axios.get<CallsPerEndpoint>('https://statistics-service1.onrender.com/callsPerEndpoint'),
        ]);
        console.log(mostFrequentRes.data)
        console.log(lastCalledRes.data)
        console.log(callsPerEndpointRes.data)

        setData({
          lastCalled: lastCalledRes.data,
          mostFrequent: mostFrequentRes.data,
          callsPerEndpoint: callsPerEndpointRes.data,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>API Call Log Statistics</h1>
      <Button style={getViewButtonStyle('lastCalled')} onClick={() => setActiveView('lastCalled')}>Last Called Endpoint</Button>
      <Button style={getViewButtonStyle('mostFrequent')} onClick={() => setActiveView('mostFrequent')}>Most Frequent Endpoint</Button>
      <Button style={getViewButtonStyle('callsPerEndpoint')} onClick={() => setActiveView('callsPerEndpoint')}>Calls Per Endpoint</Button>

      <div style={{ marginTop: '20px' }}>
        {activeView === 'lastCalled' && (
          <div>
            <h2>Last Called Endpoint:</h2>
            <p>{data.lastCalled ? `${data.lastCalled.endpoint} at ${data.lastCalled.timestamp}` : 'Loading...'}</p>
          </div>
        )}

        {activeView === 'mostFrequent' && (
          <div>
            <h2>Most Frequent Endpoint:</h2>
            <p>{data.mostFrequent ? `${data.mostFrequent.mostCalledEndpoint._id} (Count: ${data.mostFrequent.mostCalledEndpoint.count})` : 'Loading...'}</p>
          </div>
        )}

        {activeView === 'callsPerEndpoint' && (
          <div>
            <h2>Calls Per Endpoint:</h2>
            <ul>
              {data.callsPerEndpoint ? data.callsPerEndpoint.callsPerEndpoint.map((item, index) => (
                <li key={index}>{item.endpoint}: {item.count}</li>
              )) : <li>Loading...</li>}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsUser;
