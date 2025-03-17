import React from "react";
import { Card, Row, Col } from "react-bootstrap";

const HealthCounts = ({ counts }) => {
  // Ensure counts is an array
  const countsArray = Array.isArray(counts) ? counts : [];

  // Helper function to get the count for a specific status
  const getCount = (status) => {
    const item = countsArray.find((count) => count.HealthStatus === status);
    return item ? item.Count : 0;
  };

  return (
    <Row className="mb-4">
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title>Healthy Devices</Card.Title>
            <Card.Text>{getCount("Healthy")}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title>Unknown Devices</Card.Title>
            <Card.Text>{getCount("Unknown")}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title>Dead Devices</Card.Title>
            <Card.Text>{getCount("Dead")}</Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default HealthCounts;
