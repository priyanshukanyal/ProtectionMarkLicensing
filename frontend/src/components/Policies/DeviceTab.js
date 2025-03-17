import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, ListGroup } from "react-bootstrap";

const DeviceTab = () => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    name: "",
    license: "",
    groupId: "",
  });
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchDevices();
    fetchGroups();
  }, []);

  const fetchDevices = async () => {
    const res = await axios.get("http://localhost:5000/api/devices");
    setDevices(res.data);
  };

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups");
    setGroups(res.data);
  };

  const addDevice = async () => {
    if (!newDevice.name || !newDevice.license || !newDevice.groupId) return;
    await axios.post("http://localhost:5000/api/devices", newDevice);
    setNewDevice({ name: "", license: "", groupId: "" });
    fetchDevices();
  };

  const deleteDevice = async (id) => {
    await axios.delete(`http://localhost:5000/api/devices/${id}`);
    fetchDevices();
  };

  return (
    <div>
      <h4>Manage Devices</h4>
      <Form.Control
        type="text"
        placeholder="Device Name"
        value={newDevice.name}
        onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
      />
      <Form.Control
        type="text"
        placeholder="License"
        value={newDevice.license}
        onChange={(e) =>
          setNewDevice({ ...newDevice, license: e.target.value })
        }
        className="mt-2"
      />
      <Form.Select
        value={newDevice.groupId}
        onChange={(e) =>
          setNewDevice({ ...newDevice, groupId: e.target.value })
        }
        className="mt-2"
      >
        <option value="">Select Group</option>
        {groups.map((group) => (
          <option key={group.GroupID} value={group.GroupID}>
            {group.GroupName}
          </option>
        ))}
      </Form.Select>
      <Button className="mt-2" onClick={addDevice}>
        Add Device
      </Button>

      <ListGroup className="mt-3">
        {devices.map((device) => (
          <ListGroup.Item
            key={device.DeviceID}
            className="d-flex justify-content-between"
          >
            {device.DeviceName} ({device.License})
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteDevice(device.DeviceID)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default DeviceTab;
