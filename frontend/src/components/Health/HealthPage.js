import React, { useState, useEffect } from "react";
import { Container, Row, Col, Tabs, Tab, Card } from "react-bootstrap";
import axios from "axios";
import SideMenu from "../SideMenu"; // Adjust path if necessary
import HealthTabs from "./HealthTabs";
import HealthCounts from "./HealthCounts";
import HealthForm from "./HealthForm";

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
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          style={{
            backgroundColor: "#2c3e50",
            minHeight: "100vh",
            color: "white",
          }}
        >
          <SideMenu />
        </Col>

        {/* Main Content */}
        <Col md={10} style={{ padding: "20px", backgroundColor: "#ecf0f1" }}>
          <h2 className="mb-4 text-center" style={{ color: "#2c3e50" }}>
            Health Management
          </h2>

          <Card className="p-4 shadow-sm mb-4">
            <HealthCounts counts={healthCounts} />
          </Card>

          <Card className="p-4 shadow-sm">
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
          </Card>

          <Card className="p-4 mt-4 shadow-sm">
            <h4>Add or Update Health Record</h4>
            <HealthForm
              onAdd={fetchHealthRecords}
              onUpdate={fetchHealthRecords}
            />
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HealthPage;
