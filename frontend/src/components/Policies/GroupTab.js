import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Button, ListGroup } from "react-bootstrap";

const GroupTab = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const res = await axios.get("http://localhost:5000/api/groups");
    setGroups(res.data);
  };

  const addGroup = async () => {
    if (!newGroup) return;
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
            className="d-flex justify-content-between"
          >
            {group.GroupName}
            <Button
              variant="danger"
              size="sm"
              onClick={() => deleteGroup(group.GroupID)}
            >
              Delete
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default GroupTab;
