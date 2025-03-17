import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const HealthForm = ({ onAdd, onUpdate }) => {
  const [formData, setFormData] = useState({
    DeviceID: "",
    DeviceName: "",
    HealthStatus: "Healthy",
    DeviceStatus: "Active",
    LastResponse: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.HealthID) {
        // Update existing record
        await axios.put(
          `http://localhost:5000/api/health/${formData.HealthID}`,
          formData
        );
        onUpdate();
      } else {
        // Add new record
        await axios.post("http://localhost:5000/api/health", formData);
        onAdd();
      }
      setFormData({
        DeviceID: "",
        DeviceName: "",
        HealthStatus: "Healthy",
        DeviceStatus: "Active",
        LastResponse: "",
      });
    } catch (error) {
      console.error("Error saving health record:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Device ID</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter Device ID"
          value={formData.DeviceID}
          onChange={(e) =>
            setFormData({ ...formData, DeviceID: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Device Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Device Name"
          value={formData.DeviceName}
          onChange={(e) =>
            setFormData({ ...formData, DeviceName: e.target.value })
          }
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Health Status</Form.Label>
        <Form.Control
          as="select"
          value={formData.HealthStatus}
          onChange={(e) =>
            setFormData({ ...formData, HealthStatus: e.target.value })
          }
        >
          <option value="Healthy">Healthy</option>
          <option value="Unknown">Unknown</option>
          <option value="Dead">Dead</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Device Status</Form.Label>
        <Form.Control
          as="select"
          value={formData.DeviceStatus}
          onChange={(e) =>
            setFormData({ ...formData, DeviceStatus: e.target.value })
          }
        >
          <option value="Active">Active</option>
          <option value="Trial">Trial</option>
          <option value="AE">About to Expire</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Last Response</Form.Label>
        <Form.Control
          type="datetime-local"
          value={formData.LastResponse}
          onChange={(e) =>
            setFormData({ ...formData, LastResponse: e.target.value })
          }
        />
      </Form.Group>
      <Button type="submit">Save</Button>
    </Form>
  );
};

export default HealthForm;
