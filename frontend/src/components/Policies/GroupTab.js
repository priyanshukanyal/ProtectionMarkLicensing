import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, ListGroup, Modal, Card } from "react-bootstrap";

const GroupTab = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [devices, setDevices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [unassignedDevices, setUnassignedDevices] = useState([]);

  useEffect(() => {
    fetchGroups();
    fetchDevices();
  }, []);

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups");
    setGroups(res.data);
  };

  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/devices");
      console.log("Devices response:", response.data); // Debugging

      // Check if the response contains an array
      if (response.data && Array.isArray(response.data.data)) {
        setDevices(response.data.data); // Use response.data.data
      } else {
        console.error("Expected an array but got:", response.data);
        setDevices([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
      setDevices([]); // Fallback to empty array
    }
  };

  const addGroup = async () => {
    if (!newGroup.trim()) return;
    await axios.post("http://localhost:5000/api/groups", {
      GroupName: newGroup,
    });
    setNewGroup("");
    fetchGroups();
  };

  const deleteGroup = async (id) => {
    await axios.delete(`http://localhost:5000/api/groups/${id}`);
    fetchGroups();
  };

  const openAddDeviceModal = async (groupId) => {
    setSelectedGroupId(groupId);
    const unassigned = devices.filter((device) => !device.GroupID);
    setUnassignedDevices(unassigned);
    setShowModal(true);
  };

  const addDeviceToGroup = async (deviceId) => {
    try {
      const deviceToUpdate = devices.find(
        (device) => device.DeviceID === deviceId
      );
      if (!deviceToUpdate) return;

      const updatedDevice = { ...deviceToUpdate, GroupID: selectedGroupId };
      await axios.put(
        `http://localhost:5000/api/devices/${deviceId}`,
        updatedDevice
      );

      fetchDevices();
      setUnassignedDevices((prev) =>
        prev.filter((device) => device.DeviceID !== deviceId)
      );
    } catch (error) {
      console.error("Error adding device to group:", error);
    }
  };

  return (
    <div>
      <Card className="shadow-lg border-0 rounded-4 p-4">
        <h4
          className="text-center mb-4"
          style={{ color: "#1B263B", fontWeight: "bold" }}
        >
          Manage Groups
        </h4>

        {/* Add Group Section */}
        <div className="d-flex">
          <Form.Control
            type="text"
            placeholder="Enter group name"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            className="me-2"
          />
          <Button variant="primary" onClick={addGroup}>
            Add Group
          </Button>
        </div>

        {/* Group List */}
        <ListGroup className="mt-4">
          {groups.map((group) => (
            <ListGroup.Item
              key={group.GroupID}
              className="d-flex justify-content-between align-items-center shadow-sm"
            >
              <strong>{group.GroupName}</strong>
              <div>
                <Button
                  variant="outline-success"
                  size="sm"
                  className="me-2"
                  onClick={() => openAddDeviceModal(group.GroupID)}
                >
                  + Add Device
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => deleteGroup(group.GroupID)}
                >
                  ✖ Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>

      {/* Modal for adding devices */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Devices to Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {unassignedDevices.length > 0 ? (
              unassignedDevices.map((device) => (
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
              ))
            ) : (
              <p className="text-center text-muted">
                No unassigned devices available
              </p>
            )}
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
