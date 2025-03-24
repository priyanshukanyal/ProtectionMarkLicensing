import React, { useState } from "react";
import { Container, Row, Col, Tabs, Tab, Card } from "react-bootstrap";
import SideMenu from "../SideMenu"; // Adjust the import if needed
import GroupTab from "./GroupTab.js";
import DeviceTab from "./DeviceTab.js";
import PolicyTab from "./PolicyTab.js";

const Policy = () => {
  const [activeTab, setActiveTab] = useState("group");

  return (
    <Container fluid className="d-flex p-0" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Col
        md={2}
        className="d-none d-md-block shadow-lg"
        style={{
          backgroundColor: "#1B263B",
          color: "white",
          padding: "20px",
          minHeight: "100vh",
        }}
      >
        <SideMenu />
      </Col>

      {/* Main Content */}
      <Col md={10} className="p-4" style={{ backgroundColor: "#F8F9FA" }}>
        <Card className="shadow-lg border-0 rounded-4 p-4">
          <h2
            className="text-center mb-4"
            style={{ color: "#1B263B", fontWeight: "bold" }}
          >
            Policy Management
          </h2>

          {/* Tabs Section */}
          <Tabs
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
            id="policy-tabs"
            className="mb-3 custom-tabs"
            variant="pills"
            justify
          >
            <Tab eventKey="group" title="Group">
              <GroupTab />
            </Tab>
            <Tab eventKey="device" title="Device">
              <DeviceTab />
            </Tab>
            <Tab eventKey="policy" title="Policy">
              <PolicyTab />
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </Container>
  );
};

export default Policy;
