import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SideMenu from "./SideMenu";
import Policy from "./Policies/Policy.js";
import HealthPage from "./Health/HealthPage.js"; // Updated import
import LicenceReport from "./Licence/Licence.js";
import Settings from "./Settings/Settings.js";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("policy");

  const renderTabContent = () => {
    switch (activeTab) {
      case "policy":
        return <Policy />;
      case "health":
        return <HealthPage />;
      case "licence-report":
        return <LicenceReport />;
      case "settings":
        return <Settings />;
      default:
        return <Policy />;
    }
  };

  return (
    <Container fluid>
      <Row>
        <Col md={2} style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          <SideMenu onSelect={setActiveTab} />
        </Col>
        <Col md={10}>{renderTabContent()}</Col>
      </Row>
    </Container>
  );
};

export default HomePage;
