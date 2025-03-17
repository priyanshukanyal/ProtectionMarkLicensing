import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const SideMenu = () => {
  return (
    <Nav className="flex-column" variant="pills" defaultActiveKey="policy">
      <Nav.Item>
        <Nav.Link as={Link} to="/policy">
          Policy
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/health">
          Health
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/licence">
          Licence
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/report">
          Report
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} to="/settings">
          Settings
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default SideMenu;
