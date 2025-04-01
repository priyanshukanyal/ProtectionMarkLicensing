import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import SideMenu from "../SideMenu";
import { decodeLicenseCode } from "../utils/licenseUtils"; // Import the validation function

const LicenseDashboard = () => {
  const [licenseCode, setLicenseCode] = useState("");
  const [form, setForm] = useState({
    OrganizationName: "",
    PurchaseDate: "",
    ExpiryDate: "",
    Quantity: "",
    PartnerName: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleCodeChange = (e) => {
    setLicenseCode(e.target.value);
  };

  // Validate the license code
  const validateLicense = async () => {
    try {
      setError("");
      setSuccessMessage("");
      setLoading(true);

      if (!licenseCode.trim()) {
        throw new Error("Please enter a valid license code.");
      }

      // Use the frontend function to decode & validate
      const licenseData = decodeLicenseCode(licenseCode);

      // Update the form fields with decoded license data
      setForm(licenseData);

      // ✅ Now Save License to Database
      await saveLicenseToDatabase(licenseData);

      setSuccessMessage("License validated and saved successfully!");
    } catch (error) {
      setError(
        error.message || "Invalid License Code. Please check and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to save validated license in database
  const saveLicenseToDatabase = async (licenseData) => {
    try {
      console.log("License Data being sent:", licenseData); // Debugging

      // Ensure all required fields are present
      const {
        OrganizationName,
        PurchaseDate,
        ExpiryDate,
        Quantity,
        PartnerName,
      } = licenseData;

      if (
        !licenseCode ||
        !OrganizationName ||
        !PurchaseDate ||
        !ExpiryDate ||
        !Quantity ||
        !PartnerName
      ) {
        throw new Error("All fields are required before saving.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/licenses/save",
        {
          licenseCode, // Add this missing field
          OrganizationName,
          PurchaseDate,
          ExpiryDate,
          Quantity,
          PartnerName,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        console.log("License saved successfully:", response.data);
      } else {
        throw new Error(response.data.message || "Failed to save license.");
      }
    } catch (error) {
      console.error("Error saving license:", error.message);
      throw new Error("Error saving license to the database.");
    }
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
            License Dashboard
          </h2>

          {/* Messages */}
          {error && <Alert variant="danger">{error}</Alert>}
          {successMessage && <Alert variant="success">{successMessage}</Alert>}

          {/* License Code Input */}
          <Card className="p-4 shadow-sm">
            <h4>Enter License Code</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  value={licenseCode}
                  onChange={handleCodeChange}
                  placeholder="Enter License Code"
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={validateLicense}
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Validate & Save"
                )}
              </Button>
            </Form>
          </Card>

          {/* License Details */}
          <Card className="p-4 mt-4 shadow-sm">
            <h4>License Details</h4>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Organization Name</Form.Label>
                <Form.Control
                  type="text"
                  value={form.OrganizationName}
                  readOnly
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control type="text" value={form.PurchaseDate} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Expiry Date</Form.Label>
                <Form.Control type="text" value={form.ExpiryDate} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="text" value={form.Quantity} readOnly />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Partner Name</Form.Label>
                <Form.Control type="text" value={form.PartnerName} readOnly />
              </Form.Group>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LicenseDashboard;

// import React, { useState } from "react";
// import axios from "axios";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Form,
//   Button,
//   Spinner,
//   Alert,
// } from "react-bootstrap";
// import SideMenu from "../SideMenu"; // Adjust path if necessary

// const LicenseDashboard = () => {
//   const [licenseCode, setLicenseCode] = useState("");
//   const [form, setForm] = useState({
//     OrganizationName: "",
//     PurchaseDate: "",
//     ExpiryDate: "",
//     Quantity: "",
//     PartnerName: "",
//   });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");

//   // Handle input change for license code
//   const handleCodeChange = (e) => {
//     setLicenseCode(e.target.value);
//   };

//   // Fetch license details from backend
//   const fetchLicenseDetails = async () => {
//     if (!licenseCode.trim()) {
//       setError("Please enter a valid license code.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       const { data } = await axios.post(
//         "http://localhost:5000/api/licenses/validate",
//         { licenseCode },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       // Update form fields with fetched data
//       setForm({
//         OrganizationName: data?.data?.OrganizationName || "",
//         PurchaseDate: data?.data?.PurchaseDate || "",
//         ExpiryDate: data?.data?.ExpiryDate || "",
//         Quantity: data?.data?.Quantity || "",
//         PartnerName: data?.data?.PartnerName || "",
//       });
//     } catch (error) {
//       console.error("Validation Error:", error.response?.data || error.message);
//       setError(
//         error.response?.data?.message ||
//           "Invalid License Code. Please check and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Save the license to the database
//   const saveLicense = async () => {
//     if (!form.OrganizationName) {
//       setError("Please validate the license first.");
//       return;
//     }

//     setSaving(true);
//     setError("");
//     setSuccessMessage("");

//     try {
//       const { data } = await axios.post(
//         "http://localhost:5000/api/licenses/save",
//         {
//           licenseCode,
//           ...form,
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );

//       setSuccessMessage("License saved successfully!");
//       setLicenseCode("");
//       setForm({
//         OrganizationName: "",
//         PurchaseDate: "",
//         ExpiryDate: "",
//         Quantity: "",
//         PartnerName: "",
//       });
//     } catch (error) {
//       console.error("Save Error:", error.response?.data || error.message);
//       setError("Failed to save the license. Try again.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <Container fluid>
//       <Row>
//         {/* Sidebar */}
//         <Col
//           md={2}
//           style={{
//             backgroundColor: "#2c3e50",
//             minHeight: "100vh",
//             color: "white",
//           }}
//         >
//           <SideMenu />
//         </Col>

//         {/* Main Content */}
//         <Col md={10} style={{ padding: "20px", backgroundColor: "#ecf0f1" }}>
//           <h2 className="mb-4 text-center" style={{ color: "#2c3e50" }}>
//             License Dashboard
//           </h2>

//           {/* Display messages */}
//           {error && <Alert variant="danger">{error}</Alert>}
//           {successMessage && <Alert variant="success">{successMessage}</Alert>}

//           {/* License Code Input */}
//           <Card className="p-4 shadow-sm">
//             <h4>Enter License Code</h4>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Control
//                   type="text"
//                   value={licenseCode}
//                   onChange={handleCodeChange}
//                   placeholder="Enter License Code"
//                 />
//               </Form.Group>
//               <Button
//                 variant="primary"
//                 onClick={fetchLicenseDetails}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <Spinner animation="border" size="sm" />
//                 ) : (
//                   "Fetch Details"
//                 )}
//               </Button>
//             </Form>
//           </Card>

//           {/* License Details */}
//           <Card className="p-4 mt-4 shadow-sm">
//             <h4>License Details</h4>
//             <Form>
//               <Form.Group className="mb-3">
//                 <Form.Label>Organization Name</Form.Label>
//                 <Form.Control
//                   type="text"
//                   value={form.OrganizationName}
//                   readOnly
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Purchase Date</Form.Label>
//                 <Form.Control type="text" value={form.PurchaseDate} readOnly />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Expiry Date</Form.Label>
//                 <Form.Control type="text" value={form.ExpiryDate} readOnly />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Quantity</Form.Label>
//                 <Form.Control type="text" value={form.Quantity} readOnly />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Partner Name</Form.Label>
//                 <Form.Control type="text" value={form.PartnerName} readOnly />
//               </Form.Group>
//             </Form>

//             {/* Save License Button */}
//             <Button
//               variant="success"
//               onClick={saveLicense}
//               disabled={saving || !form.OrganizationName}
//             >
//               {saving ? (
//                 <Spinner animation="border" size="sm" />
//               ) : (
//                 "Save License"
//               )}
//             </Button>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default LicenseDashboard;

// // import React, { useState } from "react";
// // import axios from "axios";
// // import {
// //   Container,
// //   Row,
// //   Col,
// //   Card,
// //   Form,
// //   Button,
// //   Spinner,
// // } from "react-bootstrap";
// // import SideMenu from "../SideMenu"; // Adjust path if necessary

// // const LicenseDashboard = () => {
// //   const [licenseCode, setLicenseCode] = useState("");
// //   const [form, setForm] = useState({
// //     OrganizationName: "",
// //     PurchaseDate: "",
// //     ExpiryDate: "",
// //     Quantity: "",
// //     PartnerName: "",
// //   });
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const handleCodeChange = (e) => {
// //     setLicenseCode(e.target.value);
// //   };

// //   const fetchLicenseDetails = async () => {
// //     if (!licenseCode.trim()) {
// //       setError("Please enter a valid license code.");
// //       return;
// //     }

// //     console.log("License Code Entered for Validation:", licenseCode); // ✅ Log entered code

// //     setLoading(true);
// //     setError("");

// //     try {
// //       const { data } = await axios.post(
// //         "http://localhost:5000/api/licenses/validate",
// //         { licenseCode },
// //         { headers: { "Content-Type": "application/json" } }
// //       );

// //       console.log("Validated License Data:", data); // ✅ Log response from backend

// //       setForm({
// //         OrganizationName: data?.data?.OrganizationName || "N/A",
// //         PurchaseDate: data?.data?.PurchaseDate || "N/A",
// //         ExpiryDate: data?.data?.ExpiryDate || "N/A",
// //         Quantity: data?.data?.Quantity || "N/A",
// //         PartnerName: data?.data?.PartnerName || "N/A",
// //       });
// //     } catch (error) {
// //       console.error("Validation Error:", error.response?.data || error.message);
// //       setError(
// //         error.response?.data?.message ||
// //           "Invalid License Code. Please check and try again."
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <Container fluid>
// //       <Row>
// //         {/* Sidebar */}
// //         <Col
// //           md={2}
// //           style={{
// //             backgroundColor: "#2c3e50",
// //             minHeight: "100vh",
// //             color: "white",
// //           }}
// //         >
// //           <SideMenu />
// //         </Col>

// //         {/* Main Content */}
// //         <Col md={10} style={{ padding: "20px", backgroundColor: "#ecf0f1" }}>
// //           <h2 className="mb-4 text-center" style={{ color: "#2c3e50" }}>
// //             License Dashboard
// //           </h2>

// //           <Card className="p-4 shadow-sm">
// //             <h4>Enter License Code</h4>
// //             <Form>
// //               <Form.Group className="mb-3">
// //                 <Form.Control
// //                   type="text"
// //                   value={licenseCode}
// //                   onChange={handleCodeChange}
// //                   placeholder="Enter License Code"
// //                 />
// //               </Form.Group>
// //               <Button
// //                 variant="primary"
// //                 onClick={fetchLicenseDetails}
// //                 disabled={loading}
// //               >
// //                 {loading ? (
// //                   <Spinner animation="border" size="sm" />
// //                 ) : (
// //                   "Fetch Details"
// //                 )}
// //               </Button>
// //               {error && (
// //                 <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
// //               )}
// //             </Form>
// //           </Card>

// //           <Card className="p-4 mt-4 shadow-sm">
// //             <h4>License Details</h4>
// //             <Form>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Organization Name</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   value={form.OrganizationName}
// //                   readOnly
// //                 />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Purchase Date</Form.Label>
// //                 <Form.Control type="text" value={form.PurchaseDate} readOnly />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Expiry Date</Form.Label>
// //                 <Form.Control type="text" value={form.ExpiryDate} readOnly />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Quantity</Form.Label>
// //                 <Form.Control type="text" value={form.Quantity} readOnly />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Partner Name</Form.Label>
// //                 <Form.Control type="text" value={form.PartnerName} readOnly />
// //               </Form.Group>
// //             </Form>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default LicenseDashboard;

// // import React, { useState } from "react";
// // import axios from "axios";
// // import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
// // import SideMenu from "../SideMenu"; // Adjust path if necessary

// // const LicenseDashboard = () => {
// //   const [licenseCode, setLicenseCode] = useState("");
// //   const [form, setForm] = useState({
// //     OrganizationName: "",
// //     PurchaseDate: "",
// //     ExpiryDate: "",
// //     Quantity: "",
// //     PartnerName: "",
// //   });

// //   const [error, setError] = useState("");

// //   const handleCodeChange = (e) => {
// //     setLicenseCode(e.target.value);
// //   };

// //  const fetchLicenseDetails = async () => {
// //    if (!licenseCode.trim()) {
// //      setError("Please enter a valid license code.");
// //      return;
// //    }

// //    setError(""); // Clear previous errors

// //    try {
// //      const { data } = await axios.post(
// //        "http://localhost:5000/api/licenses/validate",
// //        { licenseCode },
// //        { headers: { "Content-Type": "application/json" } }
// //      );

// //      // Ensure missing fields don’t cause uncontrolled inputs
// //      setForm({
// //        OrganizationName: data?.OrganizationName || "",
// //        PurchaseDate: data?.PurchaseDate || "",
// //        ExpiryDate: data?.ExpiryDate || "",
// //        Quantity: data?.Quantity || "",
// //        PartnerName: data?.PartnerName || "",
// //      });
// //    } catch (error) {
// //      console.error("Validation Error:", error.response?.data || error.message);
// //      setError(
// //        error.response?.data?.message ||
// //          "Invalid License Code. Please check and try again."
// //      );
// //    }
// //  };

// //   return (
// //     <Container fluid>
// //       <Row>
// //         {/* Sidebar */}
// //         <Col
// //           md={2}
// //           style={{
// //             backgroundColor: "#2c3e50",
// //             minHeight: "100vh",
// //             color: "white",
// //           }}
// //         >
// //           <SideMenu />
// //         </Col>

// //         {/* Main Content */}
// //         <Col md={10} style={{ padding: "20px", backgroundColor: "#ecf0f1" }}>
// //           <h2 className="mb-4 text-center" style={{ color: "#2c3e50" }}>
// //             License Dashboard
// //           </h2>

// //           <Card className="p-4 shadow-sm">
// //             <h4>Enter License Code</h4>
// //             <Form>
// //               <Form.Group className="mb-3">
// //                 <Form.Control
// //                   type="text"
// //                   value={licenseCode}
// //                   onChange={handleCodeChange}
// //                   placeholder="Enter License Code"
// //                 />
// //               </Form.Group>
// //               <Button variant="primary" onClick={fetchLicenseDetails}>
// //                 Fetch Details
// //               </Button>
// //               {error && (
// //                 <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
// //               )}
// //             </Form>
// //           </Card>

// //           <Card className="p-4 mt-4 shadow-sm">
// //             <h4>License Details</h4>
// //             <Form>
// //               <Form.Group className="mb-3">
// //                 <Form.Label>Organization Name</Form.Label>
// //                 <Form.Control
// //                   type="text"
// //                   value={form.OrganizationName}
// //                   readOnly
// //                 />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Purchase Date</Form.Label>
// //                 <Form.Control type="text" value={form.PurchaseDate} readOnly />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Expiry Date</Form.Label>
// //                 <Form.Control type="text" value={form.ExpiryDate} readOnly />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Quantity</Form.Label>
// //                 <Form.Control type="number" value={form.Quantity} readOnly />
// //               </Form.Group>

// //               <Form.Group className="mb-3">
// //                 <Form.Label>Partner Name</Form.Label>
// //                 <Form.Control type="text" value={form.PartnerName} readOnly />
// //               </Form.Group>
// //             </Form>
// //           </Card>
// //         </Col>
// //       </Row>
// //     </Container>
// //   );
// // };

// // export default LicenseDashboard;

// // import React, { useState } from "react";
// // import axios from "axios";
// // import "bootstrap/dist/css/bootstrap.min.css";

// // const LicenseDashboard = () => {
// //   const [form, setForm] = useState({
// //     licenseCode: "",
// //     organizationName: "",
// //     purchaseDate: "",
// //     expiryDate: "",
// //     quantity: "",
// //     partnerName: "",
// //   });
// //   const [decoded, setDecoded] = useState(false);

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   // Decode the 16-digit code and auto-fill form fields
// //   const handleDecode = async (e) => {
// //     e.preventDefault();
// //     if (form.licenseCode.length !== 16) {
// //       alert("License code must be 16 characters.");
// //       return;
// //     }
// //     try {
// //       const { data } = await axios.post(
// //         "http://localhost:5000/api/licenses/decode",
// //         { licenseCode: form.licenseCode }
// //       );
// //       setForm({
// //         ...form,
// //         organizationName: data.organizationName,
// //         purchaseDate: data.purchaseDate,
// //         expiryDate: data.expiryDate, // Expiry date auto-fills
// //         quantity: data.quantity,
// //         partnerName: data.partnerName,
// //       });
// //       setDecoded(true);
// //     } catch (error) {
// //       console.error("Error decoding license code:", error);
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <h2>License Dashboard</h2>
// //       <form onSubmit={handleDecode} className="mb-4">
// //         <div className="row g-3">
// //           <div className="col-md-4">
// //             <input
// //               type="text"
// //               name="licenseCode"
// //               className="form-control"
// //               placeholder="Enter 16-digit License Code"
// //               value={form.licenseCode}
// //               onChange={handleChange}
// //               maxLength="16"
// //               required
// //             />
// //           </div>
// //           <div className="col-md-2">
// //             <button type="submit" className="btn btn-secondary">
// //               Decode Code
// //             </button>
// //           </div>
// //         </div>
// //       </form>

// //       {decoded && (
// //         <form>
// //           <div className="row g-3">
// //             <div className="col-md-3">
// //               <input
// //                 type="text"
// //                 name="organizationName"
// //                 className="form-control"
// //                 placeholder="Organization Name"
// //                 value={form.organizationName}
// //                 readOnly
// //               />
// //             </div>
// //             <div className="col-md-3">
// //               <input
// //                 type="text"
// //                 name="purchaseDate"
// //                 className="form-control"
// //                 placeholder="Purchase Date (YYYY-MM-DD)"
// //                 value={form.purchaseDate}
// //                 readOnly
// //               />
// //             </div>
// //             <div className="col-md-3">
// //               <input
// //                 type="text"
// //                 name="expiryDate"
// //                 className="form-control"
// //                 placeholder="Expiry Date (YYYY-MM-DD)"
// //                 value={form.expiryDate}
// //                 readOnly
// //               />
// //             </div>
// //             <div className="col-md-3">
// //               <input
// //                 type="number"
// //                 name="quantity"
// //                 className="form-control"
// //                 placeholder="Quantity"
// //                 value={form.quantity}
// //                 readOnly
// //               />
// //             </div>
// //             <div className="col-md-3">
// //               <input
// //                 type="text"
// //                 name="partnerName"
// //                 className="form-control"
// //                 placeholder="Partner Name"
// //                 value={form.partnerName}
// //                 readOnly
// //               />
// //             </div>
// //           </div>
// //         </form>
// //       )}
// //     </div>
// //   );
// // };

// // export default LicenseDashboard;

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import "bootstrap/dist/css/bootstrap.min.css";

// // const LicenseDashboard = () => {
// //   const [licenses, setLicenses] = useState([]);
// //   const [form, setForm] = useState({
// //     LicenseName: "",
// //     PurchaseDate: "",
// //     ExpiryDate: "",
// //     Quantity: "",
// //     AllocatedLicenses: "",
// //     DeallocatedLicenses: "",
// //   });

// //   useEffect(() => {
// //     fetchLicenses();
// //   }, []);

// //   // Fetch all licenses
// //   const fetchLicenses = async () => {
// //     try {
// //       const { data } = await axios.get("http://localhost:5000/api/licenses");
// //       setLicenses(data);
// //     } catch (error) {
// //       console.error("Error fetching licenses:", error);
// //     }
// //   };

// //   // Handle form input changes
// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   // Handle form submission (Add License)
// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post("http://localhost:5000/api/licenses", form);
// //       setForm({
// //         LicenseName: "",
// //         PurchaseDate: "",
// //         ExpiryDate: "",
// //         Quantity: "",
// //         AllocatedLicenses: "",
// //         DeallocatedLicenses: "",
// //       });
// //       fetchLicenses();
// //     } catch (error) {
// //       console.error("Error creating license:", error);
// //     }
// //   };

// //   // Delete a license entry
// //   const handleDelete = async (id) => {
// //     try {
// //       await axios.delete(`http://localhost:5000/api/licenses/${id}`);
// //       fetchLicenses();
// //     } catch (error) {
// //       console.error("Error deleting license:", error);
// //     }
// //   };

// //   return (
// //     <div className="container mt-5">
// //       <h2 className="mb-4">License Management</h2>
// //       <h4>Total Licenses: {licenses.length}</h4>

// //       {/* License Form */}
// //       <form onSubmit={handleSubmit} className="mb-4">
// //         <div className="row g-3">
// //           <div className="col-md-2">
// //             <input
// //               type="text"
// //               name="LicenseName"
// //               className="form-control"
// //               placeholder="License Code"
// //               value={form.LicenseName}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>
// //           <div className="col-md-2">
// //             <input
// //               type="date"
// //               name="PurchaseDate"
// //               className="form-control"
// //               value={form.PurchaseDate}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>
// //           <div className="col-md-2">
// //             <input
// //               type="date"
// //               name="ExpiryDate"
// //               className="form-control"
// //               value={form.ExpiryDate}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>
// //           <div className="col-md-2">
// //             <input
// //               type="number"
// //               name="Quantity"
// //               className="form-control"
// //               placeholder="Quantity"
// //               value={form.Quantity}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>
// //           <div className="col-md-2">
// //             <input
// //               type="number"
// //               name="AllocatedLicenses"
// //               className="form-control"
// //               placeholder="Allocated Licenses"
// //               value={form.AllocatedLicenses}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>
// //           <div className="col-md-2">
// //             <input
// //               type="number"
// //               name="DeallocatedLicenses"
// //               className="form-control"
// //               placeholder="Deallocated Licenses"
// //               value={form.DeallocatedLicenses}
// //               onChange={handleChange}
// //               required
// //             />
// //           </div>
// //           <div className="col-md-1">
// //             <button type="submit" className="btn btn-primary">
// //               Add
// //             </button>
// //           </div>
// //         </div>
// //       </form>

// //       {/* License Table */}
// //       <table className="table table-striped">
// //         <thead>
// //           <tr>
// //             <th>ID</th>
// //             <th>License Name</th>
// //             <th>Purchase Date</th>
// //             <th>Expiry Date</th>
// //             <th>Quantity</th>
// //             <th>Allocated</th>
// //             <th>Deallocated</th>
// //             <th>Actions</th>
// //           </tr>
// //         </thead>
// //         <tbody>
// //           {licenses.map((license) => (
// //             <tr key={license.LicenseID}>
// //               <td>{license.LicenseID}</td>
// //               <td>{license.LicenseName}</td>
// //               <td>{license.PurchaseDate}</td>
// //               <td>{license.ExpiryDate}</td>
// //               <td>{license.Quantity}</td>
// //               <td>{license.AllocatedLicenses}</td>
// //               <td>{license.DeallocatedLicenses}</td>
// //               <td>
// //                 <button className="btn btn-warning btn-sm me-2" disabled>
// //                   Edit
// //                 </button>
// //                 <button
// //                   className="btn btn-danger btn-sm"
// //                   onClick={() => handleDelete(license.LicenseID)}
// //                 >
// //                   Delete
// //                 </button>
// //               </td>
// //             </tr>
// //           ))}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // };

// // export default LicenseDashboard;
