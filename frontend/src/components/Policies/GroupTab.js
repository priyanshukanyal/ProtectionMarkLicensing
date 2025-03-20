import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, ListGroup, Modal } from "react-bootstrap";

const GroupTab = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [devices, setDevices] = useState([]); // All devices
  const [showModal, setShowModal] = useState(false); // Controls modal visibility
  const [selectedGroupId, setSelectedGroupId] = useState(null); // Group to which devices will be added
  const [unassignedDevices, setUnassignedDevices] = useState([]); // Devices not assigned to any group

  useEffect(() => {
    fetchGroups();
    fetchDevices();
  }, []);

  // Fetch all groups
  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups");
    setGroups(res.data);
  };

  // Fetch all devices
  const fetchDevices = async () => {
    const res = await axios.get("http://localhost:5000/api/devices");
    setDevices(res.data);
  };

  // Add a new group
  const addGroup = async () => {
    if (!newGroup) return;
    await axios.post("http://localhost:5000/api/groups", {
      GroupName: newGroup,
    });
    setNewGroup("");
    fetchGroups();
  };

  // Delete a group
  const deleteGroup = async (id) => {
    await axios.delete(`http://localhost:5000/api/groups/${id}`);
    fetchGroups();
  };

  // Open modal and fetch unassigned devices
  const openAddDeviceModal = async (groupId) => {
    setSelectedGroupId(groupId);
    const unassigned = devices.filter((device) => !device.GroupID); // Filter devices without a group
    setUnassignedDevices(unassigned);
    setShowModal(true);
  };

  // Add a device to the selected group
  const addDeviceToGroup = async (deviceId) => {
    try {
      // Find the device to be updated
      const deviceToUpdate = devices.find(
        (device) => device.DeviceID === deviceId
      );

      if (!deviceToUpdate) {
        console.error("Device not found.");
        return;
      }

      // Update the GroupID of the device
      const updatedDevice = {
        ...deviceToUpdate, // Include all existing fields
        GroupID: selectedGroupId, // Update the GroupID
      };

      // Send the updated device object to the backend
      await axios.put(
        `http://localhost:5000/api/devices/${deviceId}`,
        updatedDevice
      );

      // Refresh the devices list
      fetchDevices();

      // Remove the added device from the unassigned devices list
      setUnassignedDevices((prev) =>
        prev.filter((device) => device.DeviceID !== deviceId)
      );
    } catch (error) {
      console.error("Error adding device to group:", error);
    }
  };

  return (
    <div>
      <h4>Manage Groups</h4>
      <Form.Control
        type="text"
        placeholder="Enter group name"
        value={newGroup}
        onChange={(e) => setNewGroup(e.target.value)}
      />
      <Button className="mt-2" onClick={addGroup}>
        Add Group
      </Button>
      <ListGroup className="mt-3">
        {groups.map((group) => (
          <ListGroup.Item
            key={group.GroupID}
            className="d-flex justify-content-between align-items-center"
          >
            {group.GroupName}
            <div>
              <Button
                variant="success"
                size="sm"
                className="me-2"
                onClick={() => openAddDeviceModal(group.GroupID)}
              >
                Add Device
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteGroup(group.GroupID)}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal for adding devices to a group */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Devices to Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {unassignedDevices.map((device) => (
              <ListGroup.Item
                key={device.DeviceID}
                className="d-flex justify-content-between align-items-center"
              >
                {device.DeviceName}
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => addDeviceToGroup(device.DeviceID)}
                >
                  Add
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default GroupTab;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Form, Button, ListGroup } from "react-bootstrap";

// const GroupTab = () => {
//   const [groups, setGroups] = useState([]);
//   const [newGroup, setNewGroup] = useState("");

//   useEffect(() => {
//     fetchGroups();
//   }, []);

//   const fetchGroups = async () => {
//     const res = await axios.get("http://localhost:5000/api/groups");
//     setGroups(res.data);
//   };

//   const addGroup = async () => {
//     if (!newGroup) return;
//     await axios.post("http://localhost:5000/api/groups", {
//       GroupName: newGroup,
//     });
//     setNewGroup("");
//     fetchGroups();
//   };

//   const deleteGroup = async (id) => {
//     await axios.delete(`http://localhost:5000/api/groups/${id}`);
//     fetchGroups();
//   };

//   return (
//     <div>
//       <h4>Manage Groups</h4>
//       <Form.Control
//         type="text"
//         placeholder="Enter group name"
//         value={newGroup}
//         onChange={(e) => setNewGroup(e.target.value)}
//       />
//       <Button className="mt-2" onClick={addGroup}>
//         Add Group
//       </Button>
//       <ListGroup className="mt-3">
//         {groups.map((group) => (
//           <ListGroup.Item
//             key={group.GroupID}
//             className="d-flex justify-content-between"
//           >
//             {group.GroupName}
//             <Button
//               variant="danger"
//               size="sm"
//               onClick={() => deleteGroup(group.GroupID)}
//             >
//               Delete
//             </Button>
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//     </div>
//   );
// };

// export default GroupTab;
