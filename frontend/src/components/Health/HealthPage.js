import React, { useState, useEffect } from "react";
import { Tabs, Tab } from "react-bootstrap";
import HealthTabs from "./HealthTabs";
import HealthCounts from "./HealthCounts";
import HealthForm from "./HealthForm";
import axios from "axios";

const HealthPage = () => {
  const [healthRecords, setHealthRecords] = useState([]);
  const [healthCounts, setHealthCounts] = useState({});
  const [activeTab, setActiveTab] = useState("healthy");

  // Fetch health records and counts on component mount
  useEffect(() => {
    fetchHealthRecords();
    fetchHealthCounts();
  }, []);

  // Fetch all health records
  const fetchHealthRecords = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/health");
      setHealthRecords(response.data);
    } catch (error) {
      console.error("Error fetching health records:", error);
    }
  };

  // Fetch health counts
  const fetchHealthCounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/health/counts"
      );
      setHealthCounts(response.data);
    } catch (error) {
      console.error("Error fetching health counts:", error);
    }
  };

  return (
    <div>
      <h2>Health Management</h2>
      <HealthCounts counts={healthCounts} />
      <Tabs
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key)}
        id="health-tabs"
      >
        <Tab eventKey="healthy" title="Healthy">
          <HealthTabs
            records={healthRecords.filter(
              (record) => record.HealthStatus === "Healthy"
            )}
          />
        </Tab>
        <Tab eventKey="unknown" title="Unknown">
          <HealthTabs
            records={healthRecords.filter(
              (record) => record.HealthStatus === "Unknown"
            )}
          />
        </Tab>
        <Tab eventKey="dead" title="Dead">
          <HealthTabs
            records={healthRecords.filter(
              (record) => record.HealthStatus === "Dead"
            )}
          />
        </Tab>
      </Tabs>
      <HealthForm onAdd={fetchHealthRecords} onUpdate={fetchHealthRecords} />
    </div>
  );
};

export default HealthPage;
