import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  House,
  Activity,
  Key,
  FileText,
  Laptop,
  Gear,
} from "react-bootstrap-icons";

const SideMenu = () => {
  const location = useLocation();

  return (
    <div
      style={{
        width: "250px",
        minHeight: "100vh",
        backgroundColor: "#2c3e50",
        padding: "20px",
        color: "white",
      }}
    >
      <h4 className="text-center mb-4" style={{ color: "#ecf0f1" }}>
        Admin Panel
      </h4>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/policy"
            active={location.pathname === "/policy"}
            className="menu-link"
          >
            <House className="me-2" /> Policy
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/add-device"
            active={location.pathname === "/add-device"}
            className="menu-link"
          >
            <Laptop className="me-2" /> Device
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/health"
            active={location.pathname === "/health"}
            className="menu-link"
          >
            <Activity className="me-2" /> Health
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/licence"
            active={location.pathname === "/licence"}
            className="menu-link"
          >
            <Key className="me-2" /> Licence
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/report"
            active={location.pathname === "/report"}
            className="menu-link"
          >
            <FileText className="me-2" /> Report
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/settings"
            active={location.pathname === "/settings"}
            className="menu-link"
          >
            <Gear className="me-2" /> Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default SideMenu;
