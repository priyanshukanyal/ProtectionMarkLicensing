import React from "react";
import { Table } from "react-bootstrap";

const HealthTabs = ({ records }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Device ID</th>
          <th>Device Name</th>
          <th>Health Status</th>
          <th>Device Status</th>
          <th>Last Response</th>
        </tr>
      </thead>
      <tbody>
        {records.map((record) => (
          <tr key={record.HealthID}>
            <td>{record.DeviceID}</td>
            <td>{record.DeviceName}</td>
            <td>{record.HealthStatus}</td>
            <td>{record.DeviceStatus}</td>
            <td>{new Date(record.LastResponse).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default HealthTabs;
