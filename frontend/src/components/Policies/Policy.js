import React, { useState } from "react";
import { Container, Row, Col, Tabs, Tab, Card } from "react-bootstrap";
import SideMenu from "../SideMenu"; // Adjust the import if needed
import GroupTab from "./GroupTab.js";
import DeviceTab from "./DeviceTab.js";
import PolicyTab from "./PolicyTab.js";

const Policy = () => {
  const [activeTab, setActiveTab] = useState("group");

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
            Policy Management
          </h2>

          {/* Tabs Section */}
          <Card className="p-4 shadow-sm">
            <Tabs
              activeKey={activeTab}
              onSelect={(key) => setActiveTab(key)}
              id="policy-tabs"
              className="mb-3"
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
      </Row>
    </Container>
  );
};

export default Policy;
