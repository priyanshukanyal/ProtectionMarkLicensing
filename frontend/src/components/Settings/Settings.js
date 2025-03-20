import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import SideMenu from "../SideMenu"; // Importing Sidebar

const Settings = () => {
  const [uriConfig, setUriConfig] = useState("");
  const [retireInterval, setRetireInterval] = useState("");

  const handleSave = () => {
    console.log("Saved Settings:", { uriConfig, retireInterval });
    alert("Settings saved successfully!");
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
            Settings
          </h2>

          <Card
            className="p-4 shadow-sm"
            style={{ maxWidth: "600px", margin: "auto" }}
          >
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>URI Configuration:</Form.Label>
                <Form.Control
                  type="text"
                  value={uriConfig}
                  onChange={(e) => setUriConfig(e.target.value)}
                  placeholder="Enter URI"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Retire Interval (in minutes):</Form.Label>
                <Form.Control
                  type="number"
                  value={retireInterval}
                  onChange={(e) => setRetireInterval(e.target.value)}
                  placeholder="Enter interval"
                />
              </Form.Group>

              <Button
                variant="dark"
                onClick={handleSave}
                style={{ width: "100%", backgroundColor: "#2c3e50" }}
              >
                Save Settings
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
