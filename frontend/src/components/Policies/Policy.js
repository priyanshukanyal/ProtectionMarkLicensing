import React, { useState } from "react";
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap";
import SideMenu from "../SideMenu"; // Adjust the import if needed
import GroupTab from "./GroupTab.js";
import DeviceTab from "./DeviceTab.js";
import PolicyTab from "./PolicyTab.js";

const Policy = () => {
  const [activeTab, setActiveTab] = useState("group");

  return (
    <Container fluid>
      <Row>
        <Col md={2} style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          <SideMenu />
        </Col>
        <Col md={10}>
          <h2>Policy Management</h2>
          <Tabs
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
            id="policy-tabs"
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
        </Col>
      </Row>
    </Container>
  );
};

export default Policy;
