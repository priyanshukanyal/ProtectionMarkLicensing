import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SideMenu from "./SideMenu";
import Policy from "./Policies/Policy.js";
import HealthPage from "./Health/HealthPage.js";
import LicenceReport from "./Licence/Licence.js";
import Settings from "./Settings/Settings.js";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h2>Dashboard</h2>
            <p>
              Monitor and manage your watermark security solutions effectively.
            </p>
          </div>
        );
      case "policy":
        return <Policy />;
      case "health":
        return <HealthPage />;
      case "licence-report":
        return <LicenceReport />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div>
            <h2>Dashboard</h2>
            <p>
              Monitor and manage your watermark security solutions effectively.
            </p>
          </div>
        );
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col
          md={2}
          style={{
            backgroundColor: "#2c3e50",
            minHeight: "100vh",
            color: "white",
          }}
        >
          <SideMenu onSelect={setActiveTab} />
        </Col>
        <Col md={10} style={{ padding: "20px", backgroundColor: "#ecf0f1" }}>
          <h1 style={{ color: "#34495e" }}>Welcome to Protection Mark</h1>
          <p style={{ color: "#7f8c8d" }}>
            Your trusted solution for watermark security on devices.
          </p>
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            {renderTabContent()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
