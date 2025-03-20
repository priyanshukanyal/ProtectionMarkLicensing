import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Table,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import SideMenu from "../SideMenu";

const Device = () => {
  const [devices, setDevices] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newDevice, setNewDevice] = useState({
    DeviceName: "",
    MACAddress: "",
    IPAddress: "",
    Allocated: false,
    LicenseID: "",
    GroupID: "",
  });
  const [loading, setLoading] = useState({
    devices: false,
    licenses: false,
    groups: false,
  });
  const [error, setError] = useState({
    devices: null,
    licenses: null,
    groups: null,
  });

  useEffect(() => {
    fetchDevices();
    fetchLicenses();
    fetchGroups();
  }, []);

  const fetchDevices = async () => {
    setLoading((prev) => ({ ...prev, devices: true }));
    setError((prev) => ({ ...prev, devices: null }));
    try {
      const res = await axios.get("http://localhost:5000/api/devices");
      const updatedDevices = res.data.map((device) => ({
        ...device,
        Allocated: !!device.Allocated, // Ensures BIT (0/1) is converted to Boolean
      }));
      setDevices(updatedDevices);
    } catch (error) {
      setError((prev) => ({ ...prev, devices: "Failed to fetch devices." }));
      console.error("Error fetching devices:", error);
    } finally {
      setLoading((prev) => ({ ...prev, devices: false }));
    }
  };

  const fetchLicenses = async () => {
    setLoading((prev) => ({ ...prev, licenses: true }));
    setError((prev) => ({ ...prev, licenses: null }));
    try {
      const res = await axios.get("http://localhost:5000/api/licenses");
      setLicenses(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setError((prev) => ({ ...prev, licenses: "Failed to fetch licenses." }));
      console.error("Error fetching licenses:", error);
    } finally {
      setLoading((prev) => ({ ...prev, licenses: false }));
    }
  };

  const fetchGroups = async () => {
    setLoading((prev) => ({ ...prev, groups: true }));
    setError((prev) => ({ ...prev, groups: null }));
    try {
      const res = await axios.get("http://localhost:5000/api/groups");
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      setError((prev) => ({ ...prev, groups: "Failed to fetch groups." }));
      console.error("Error fetching groups:", error);
    } finally {
      setLoading((prev) => ({ ...prev, groups: false }));
    }
  };

  const addDevice = async () => {
    if (!newDevice.DeviceName || !newDevice.GroupID) {
      alert("Device Name and Group are required.");
      return;
    }

    const payload = {
      DeviceName: newDevice.DeviceName,
      MACAddress: newDevice.MACAddress || null,
      IPAddress: newDevice.IPAddress || null,
      Allocated: newDevice.Allocated || false,
      LicenseID: newDevice.LicenseID || null,
      GroupID: newDevice.GroupID,
    };

    try {
      await axios.post("http://localhost:5000/api/devices", payload);
      setNewDevice({
        DeviceName: "",
        MACAddress: "",
        IPAddress: "",
        Allocated: false,
        LicenseID: "",
        GroupID: "",
      });
      fetchDevices();
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device.");
    }
  };

  const deleteDevice = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/devices/${id}`);
      fetchDevices();
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("Failed to delete device.");
    }
  };

  return (
    <Container fluid>
      <Row>
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

        <Col md={10} style={{ padding: "20px", backgroundColor: "#ecf0f1" }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 style={{ color: "#2c3e50" }}>Manage Devices</h4>
            <Button variant="primary">Add from Active Directory</Button>
          </div>

          {/* Error Messages */}
          {error.devices && <Alert variant="danger">{error.devices}</Alert>}
          {error.licenses && <Alert variant="danger">{error.licenses}</Alert>}
          {error.groups && <Alert variant="danger">{error.groups}</Alert>}

          {/* Add Device Form */}
          <Form className="mb-4">
            <Form.Group>
              <Form.Label>Device Name</Form.Label>
              <Form.Control
                type="text"
                value={newDevice.DeviceName}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, DeviceName: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>MAC Address</Form.Label>
              <Form.Control
                type="text"
                value={newDevice.MACAddress}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, MACAddress: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>IP Address</Form.Label>
              <Form.Control
                type="text"
                value={newDevice.IPAddress}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, IPAddress: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Allocated</Form.Label>
              <Form.Check
                type="checkbox"
                checked={newDevice.Allocated}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, Allocated: e.target.checked })
                }
              />
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>License</Form.Label>
              <Form.Select
                value={newDevice.LicenseID}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, LicenseID: e.target.value })
                }
              >
                <option value="">Select License</option>
                {licenses.map((license) => (
                  <option key={license.LicenseID} value={license.LicenseID}>
                    {license.LicenseName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mt-2">
              <Form.Label>Group</Form.Label>
              <Form.Select
                value={newDevice.GroupID}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, GroupID: e.target.value })
                }
                required
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.GroupID} value={group.GroupID}>
                    {group.GroupName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button className="mt-3" onClick={addDevice}>
              Add Device
            </Button>
          </Form>

          {/* Devices Table */}
          {loading.devices ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Device Name</th>
                  <th>MAC Address</th>
                  <th>IP Address</th>
                  <th>Allocated</th>
                  <th>License</th>
                  <th>Group</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr key={device.DeviceID}>
                    <td>{index + 1}</td>
                    <td>{device.DeviceName}</td>
                    <td>{device.MACAddress}</td>
                    <td>{device.IPAddress}</td>
                    <td>{device.Allocated ? "Yes" : "No"}</td>
                    <td>
                      {licenses.find((l) => l.LicenseID === device.LicenseID)
                        ?.LicenseName || "N/A"}
                    </td>
                    <td>
                      {groups.find((g) => g.GroupID === device.GroupID)
                        ?.GroupName || "N/A"}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteDevice(device.DeviceID)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Device;
