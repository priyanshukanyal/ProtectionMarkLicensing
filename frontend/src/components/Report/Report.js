import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import SideMenu from "../SideMenu"; // Importing Sidebar
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement
);

const Report = () => {
  // Sample Data
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Watermarks Applied",
        data: [30, 50, 80, 60, 90],
        backgroundColor: "#3498db",
      },
    ],
  };

  const doughnutData = {
    labels: ["Secure", "Compromised", "Pending"],
    datasets: [
      {
        label: "System Status",
        data: [70, 20, 10],
        backgroundColor: ["#2ecc71", "#e74c3c", "#f1c40f"],
      },
    ],
  };

  const lineData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Threat Detections",
        data: [5, 10, 3, 8],
        borderColor: "#e67e22",
        borderWidth: 2,
      },
    ],
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
            Reports & Analytics
          </h2>

          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="p-3 mb-4 shadow-sm">
                <h5 className="text-center">Watermarks Applied (Monthly)</h5>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={barData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="p-3 mb-4 shadow-sm">
                <h5 className="text-center">System Security Status</h5>
                <div
                  style={{
                    height: "300px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Doughnut
                    data={doughnutData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </Card>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={10}>
              <Card className="p-3 shadow-sm">
                <h5 className="text-center">Threat Detection Trends</h5>
                <div style={{ height: "300px" }}>
                  <Line
                    data={lineData}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Report;
