import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";

interface ApiCallLog {
  _id?: string;
  endpoint?: string;
  count?: number;
}

interface DataState {
  lastCalled: ApiCallLog | null;
  mostFrequent: string | null;
  callsPerEndpoint: ApiCallLog[];
}

const StatisticsTermini: React.FC = () => {
  const [data, setData] = useState<DataState>({
    lastCalled: null,
    mostFrequent: null,
    callsPerEndpoint: [],
  });
  const [activeView, setActiveView] = useState<
    "lastCalled" | "mostFrequent" | "callsPerEndpoint"
  >("lastCalled");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lastCalledRes, mostFrequentRes, callsPerEndpointRes] =
          await Promise.all([
            axios.get(
              "https://blazhe-statistika.onrender.com/lastCalledEndpoint"
            ),
            axios.get("https://blazhe-statistika.onrender.com/mostCalled"),
            axios.get(
              "https://blazhe-statistika.onrender.com/callsPerEndpoint"
            ),
          ]);

        setData({
          lastCalled: lastCalledRes.data,
          mostFrequent: mostFrequentRes.data,
          callsPerEndpoint: callsPerEndpointRes.data,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getViewButtonStyle = (
    viewName: "lastCalled" | "mostFrequent" | "callsPerEndpoint"
  ) => {
    return activeView === viewName
      ? { backgroundColor: "#007bff", color: "white" }
      : { backgroundColor: "#e7e7e7", color: "black" };
  };

  return (
    <div>
      <h1>API Call Log Statistics</h1>
      <Button
        style={getViewButtonStyle("lastCalled")}
        onClick={() => setActiveView("lastCalled")}
      >
        Last Called Endpoint
      </Button>
      <Button
        style={getViewButtonStyle("mostFrequent")}
        onClick={() => setActiveView("mostFrequent")}
      >
        Most Frequent Endpoint
      </Button>
      <Button
        style={getViewButtonStyle("callsPerEndpoint")}
        onClick={() => setActiveView("callsPerEndpoint")}
      >
        Calls Per Endpoint
      </Button>

      <div style={{ marginTop: "20px" }}>
        {activeView === "lastCalled" && (
          <div>
            <h2>Last Called Endpoint:</h2>
            <p>
              {data.lastCalled ? data.lastCalled.endpoint : "No data found"}
            </p>
          </div>
        )}

        {activeView === "mostFrequent" && (
          <div>
            <h2>Most Frequent Endpoint:</h2>
            <p>{data.mostFrequent || "No data found"}</p>
          </div>
        )}

        {activeView === "callsPerEndpoint" && (
          <div>
            <h2>Calls Per Endpoint:</h2>
            <ul>
              {data.callsPerEndpoint.map((item, index) => (
                <li key={index}>
                  {item._id}: {item.count}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsTermini;
