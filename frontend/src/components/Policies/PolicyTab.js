import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  ListGroup,
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

const PolicyTab = () => {
  const [policies, setPolicies] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");

  const [newPolicy, setNewPolicy] = useState({
    PolicyName: "",
    SystemName: "No",
    UserName: "No",
    IPAddress: "No",
    MACAddress: "No",
    SerialDiskNumber: "No",
    Company: "",
    Opacity: "",
    Density: "",
    FontSize: "",
    LineDisplay: "",
    QRCode: "No",
    DomainName: "No",
    EmailAddress: "No",
  });

  useEffect(() => {
    fetchPolicies();
    fetchGroups();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/policies");
      setPolicies(res.data);
    } catch (error) {
      console.error("Error fetching policies", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/groups");
      setGroups(res.data);
    } catch (error) {
      console.error("Error fetching groups", error);
    }
  };

  const handleCheckboxChange = (field) => {
    setNewPolicy((prevPolicy) => ({
      ...prevPolicy,
      [field]: prevPolicy[field] === "Yes" ? "No" : "Yes",
    }));
  };

  const addPolicy = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/policies",
        newPolicy
      );
      if (selectedGroup) {
        await axios.post("http://localhost:5000/api/policies/attach-group", {
          groupId: selectedGroup,
          policyId: res.data.PolicyID,
        });
      }
      setNewPolicy({
        PolicyName: "",
        SystemName: "No",
        UserName: "No",
        IPAddress: "No",
        MACAddress: "No",
        SerialDiskNumber: "No",
        Company: "",
        Opacity: "",
        Density: "",
        FontSize: "",
        LineDisplay: "",
        QRCode: "No",
        DomainName: "No",
        EmailAddress: "No",
      });
      setSelectedGroup("");
      fetchPolicies();
    } catch (error) {
      console.error("Error adding policy", error);
    }
  };

  return (
    <Container>
      <h4 className="mt-3">Manage Policies</h4>
      <Row className="mt-3">
        {/* Top Left - Stamp Section */}
        <Col md={6}>
          <Card className="p-3 shadow">
            <h5 className="mb-3">Stamp - Configure your Screen Stamp</h5>

            <Form.Group className="mb-2">
              <Form.Label>Policy Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Policy Name"
                value={newPolicy.PolicyName}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, PolicyName: e.target.value })
                }
              />
            </Form.Group>

            {[
              "SystemName",
              "UserName",
              "IPAddress",
              "MACAddress",
              "SerialDiskNumber",
            ].map((field) => (
              <Form.Group key={field} className="mb-2">
                <Form.Check
                  type="checkbox"
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  checked={newPolicy[field] === "Yes"}
                  onChange={() => handleCheckboxChange(field)}
                />
              </Form.Group>
            ))}

            <Form.Group className="mb-2">
              <Form.Label>Company</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Company Name"
                value={newPolicy.Company}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, Company: e.target.value })
                }
              />
            </Form.Group>
          </Card>
        </Col>

        {/* Top Right - Intensity Section */}
        <Col md={6}>
          <Card className="p-3 shadow">
            <h5 className="mb-3">Intensity - Choose Intensity of WaterMark</h5>

            {["Opacity", "Density", "FontSize"].map((field) => (
              <Form.Group key={field} className="mb-2">
                <Form.Label>
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </Form.Label>
                <Form.Select
                  value={newPolicy[field]}
                  onChange={(e) =>
                    setNewPolicy({ ...newPolicy, [field]: e.target.value })
                  }
                >
                  <option value="">Select</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </Form.Select>
              </Form.Group>
            ))}
          </Card>
        </Col>
      </Row>

      <Row className="mt-3">
        {/* Bottom Left - Display Section */}
        <Col md={6}>
          <Card className="p-3 shadow">
            <h5 className="mb-3">Display - Configure what to show on screen</h5>

            <Form.Group className="mb-2">
              <Form.Label>Line Display</Form.Label>
              <Form.Select
                value={newPolicy.LineDisplay}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, LineDisplay: e.target.value })
                }
              >
                <option value="">Select</option>
                <option value="Singleline">Singleline</option>
                <option value="Multiline">Multiline</option>
              </Form.Select>
            </Form.Group>

            {["QRCode", "DomainName", "EmailAddress"].map((field) => (
              <Form.Group key={field} className="mb-2">
                <Form.Check
                  type="checkbox"
                  label={field.replace(/([A-Z])/g, " $1").trim()}
                  checked={newPolicy[field] === "Yes"}
                  onChange={() => handleCheckboxChange(field)}
                />
              </Form.Group>
            ))}
          </Card>
        </Col>

        {/* Bottom Right - Group Selection & Add Policy */}
        <Col md={6}>
          <Card className="p-3 shadow">
            <h5 className="mb-3">Select Group & Submit your Policy</h5>

            <Form.Group className="mb-2">
              <Form.Label>Select Group</Form.Label>
              <Form.Select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">Select Group</option>
                {groups.map((group) => (
                  <option key={group.GroupID} value={group.GroupID}>
                    {group.GroupName}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button className="mt-3" onClick={addPolicy}>
              Add Policy
            </Button>
          </Card>
        </Col>
      </Row>

      {/* Existing Policies List */}
      <h5 className="mt-4">Existing Policies</h5>
      <ListGroup>
        {policies.map((policy) => (
          <ListGroup.Item key={policy.PolicyID}>
            <strong>{policy.PolicyName}</strong> - {policy.Company}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default PolicyTab;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Form, Button, ListGroup, Card } from "react-bootstrap";

// const PolicyTab = () => {
//   const [policies, setPolicies] = useState([]);
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState("");

//   const [newPolicy, setNewPolicy] = useState({
//     PolicyName: "",
//     SystemName: "No",
//     UserName: "No",
//     IPAddress: "No",
//     MACAddress: "No",
//     SerialDiskNumber: "No",
//     Company: "",
//     Opacity: "",
//     Density: "",
//     FontSize: "",
//     LineDisplay: "",
//     QRCode: "No",
//     DomainName: "No",
//     EmailAddress: "No",
//   });

//   useEffect(() => {
//     fetchPolicies();
//     fetchGroups();
//   }, []);

//   const fetchPolicies = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/policies");
//       setPolicies(res.data);
//     } catch (error) {
//       console.error("Error fetching policies", error);
//     }
//   };

//   const fetchGroups = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/groups");
//       setGroups(res.data);
//     } catch (error) {
//       console.error("Error fetching groups", error);
//     }
//   };

//   const handleCheckboxChange = (field) => {
//     setNewPolicy((prevPolicy) => ({
//       ...prevPolicy,
//       [field]: prevPolicy[field] === "Yes" ? "No" : "Yes",
//     }));
//   };

//   const addPolicy = async () => {
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/policies",
//         newPolicy
//       );
//       if (selectedGroup) {
//         await axios.post("http://localhost:5000/api/policies/attach-group", {
//           groupId: selectedGroup,
//           policyId: res.data.PolicyID,
//         });
//       }
//       setNewPolicy({
//         PolicyName: "",
//         SystemName: "No",
//         UserName: "No",
//         IPAddress: "No",
//         MACAddress: "No",
//         SerialDiskNumber: "No",
//         Company: "",
//         Opacity: "",
//         Density: "",
//         FontSize: "",
//         LineDisplay: "",
//         QRCode: "No",
//         DomainName: "No",
//         EmailAddress: "No",
//       });
//       setSelectedGroup("");
//       fetchPolicies();
//     } catch (error) {
//       console.error("Error adding policy", error);
//     }
//   };

//   return (
//     <div>
//       <h4>Manage Policies</h4>

//       {/* Stamp Box */}
//       <Card className="p-3 mt-3 shadow">
//         <h5 className="mb-3">Stamp - Configure your Screen Stamp</h5>

//         {/* Policy Name Input */}
//         <Form.Group className="mb-2">
//           <Form.Label>Policy Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Enter Policy Name"
//             value={newPolicy.PolicyName}
//             onChange={(e) =>
//               setNewPolicy({ ...newPolicy, PolicyName: e.target.value })
//             }
//           />
//         </Form.Group>

//         {/* Yes/No Checkboxes */}
//         {[
//           "SystemName",
//           "UserName",
//           "IPAddress",
//           "MACAddress",
//           "SerialDiskNumber",
//         ].map((field) => (
//           <Form.Group key={field} className="mb-2">
//             <Form.Check
//               type="checkbox"
//               label={field.replace(/([A-Z])/g, " $1").trim()}
//               checked={newPolicy[field] === "Yes"}
//               onChange={() => handleCheckboxChange(field)}
//             />
//           </Form.Group>
//         ))}

//         {/* Company Input */}
//         <Form.Group className="mb-2">
//           <Form.Label>Organisation Name</Form.Label>
//           <Form.Control
//             type="text"
//             placeholder="Protected by ProtectionMark"
//             value={newPolicy.Company}
//             onChange={(e) =>
//               setNewPolicy({ ...newPolicy, Company: e.target.value })
//             }
//           />
//         </Form.Group>
//       </Card>

//       {/* Intensity Box */}
//       <Card className="p-3 mt-3 shadow">
//         <h5 className="mb-3">Intensity - Choose Intensity of WaterMark</h5>
//         {["Opacity", "Density", "FontSize"].map((field) => (
//           <Form.Group key={field} className="mb-2">
//             <Form.Label>{field.replace(/([A-Z])/g, " $1").trim()}</Form.Label>
//             <Form.Select
//               value={newPolicy[field]}
//               onChange={(e) =>
//                 setNewPolicy({ ...newPolicy, [field]: e.target.value })
//               }
//             >
//               <option value="">Select</option>
//               <option value="High">High</option>
//               <option value="Medium">Medium</option>
//               <option value="Low">Low</option>
//             </Form.Select>
//           </Form.Group>
//         ))}
//       </Card>

//       {/* Display Box */}
//       <Card className="p-3 mt-3 shadow">
//         <h5 className="mb-3">Display - Configure what to show on screen</h5>
//         <Form.Group className="mb-2">
//           <Form.Label>Line Display</Form.Label>
//           <Form.Select
//             value={newPolicy.LineDisplay}
//             onChange={(e) =>
//               setNewPolicy({ ...newPolicy, LineDisplay: e.target.value })
//             }
//           >
//             <option value="">Select</option>
//             <option value="Singleline">Singleline</option>
//             <option value="Multiline">Multiline</option>
//           </Form.Select>
//         </Form.Group>

//         {/* Yes/No Checkboxes */}
//         {["QRCode", "DomainName", "EmailAddress"].map((field) => (
//           <Form.Group key={field} className="mb-2">
//             <Form.Check
//               type="checkbox"
//               label={field.replace(/([A-Z])/g, " $1").trim()}
//               checked={newPolicy[field] === "Yes"}
//               onChange={() => handleCheckboxChange(field)}
//             />
//           </Form.Group>
//         ))}
//       </Card>

//       {/* Group Selection */}
//       <Form className="mt-3">
//         <Form.Group className="mt-2">
//           <Form.Label>Select Group</Form.Label>
//           <Form.Select
//             value={selectedGroup}
//             onChange={(e) => setSelectedGroup(e.target.value)}
//           >
//             <option value="">Select Group</option>
//             {groups.map((group) => (
//               <option key={group.GroupID} value={group.GroupID}>
//                 {group.GroupName}
//               </option>
//             ))}
//           </Form.Select>
//         </Form.Group>

//         <Button className="mt-3" onClick={addPolicy}>
//           Add Policy
//         </Button>
//       </Form>

//       {/* Existing Policies */}
//       <h5 className="mt-4">Existing Policies</h5>
//       <ListGroup>
//         {policies.map((policy) => (
//           <ListGroup.Item key={policy.PolicyID}>
//             <strong>{policy.PolicyName}</strong> - {policy.Company}
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//     </div>
//   );
// };

// export default PolicyTab;
