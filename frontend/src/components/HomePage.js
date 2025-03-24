import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import SideMenu from "./SideMenu";
import Policy from "./Policies/Policy.js";
import HealthPage from "./Health/HealthPage.js";
import LicenceReport from "./Licence/Licence.js";
import Settings from "./Settings/Settings.js";
import cyberSecurityImg from "../assets/cybersecurity.webp"; // Add a relevant image in assets

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="text-center">
            <h2 className="text-primary fw-bold">Dashboard</h2>
            <p className="text-muted">
              Monitor and manage your watermark security solutions effectively.
            </p>
            <img
              src={cyberSecurityImg}
              alt="Cybersecurity"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "80%", marginTop: "20px" }}
            />
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
          <div className="text-center">
            <h2 className="text-primary fw-bold">Dashboard</h2>
            <p className="text-muted">
              Monitor and manage your watermark security solutions effectively.
            </p>
            <img
              src={cyberSecurityImg}
              alt="Cybersecurity"
              className="img-fluid rounded shadow"
              style={{ maxWidth: "80%", marginTop: "20px" }}
            />
          </div>
        );
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          className="d-none d-md-block bg-dark text-white vh-100 p-3 shadow-sm"
        >
          <SideMenu onSelect={setActiveTab} />
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4 bg-light">
          {/* Hero Section */}
          <Card className="text-white border-0 shadow-lg">
            <Card.Img
              src="https://ipkeys.com/wp-content/uploads/2024/04/iStock-1204106166-1024x611.jpg"
              alt="Cybersecurity"
              className="card-img"
              style={{ height: "300px", objectFit: "cover", opacity: "0.8" }}
            />
            <Card.ImgOverlay className="d-flex flex-column justify-content-center align-items-center">
              <h1 className="fw-bold">Protection Mark</h1>
              <p className="fs-5">
                Your trusted solution for watermark security on devices.
              </p>
              <Button variant="primary" size="lg" className="fw-bold shadow">
                Learn More
              </Button>
            </Card.ImgOverlay>
          </Card>

          {/* Content Section */}
          <div
            className="mt-4 p-4 bg-white rounded shadow-lg"
            style={{ minHeight: "400px" }}
          >
            {renderTabContent()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
