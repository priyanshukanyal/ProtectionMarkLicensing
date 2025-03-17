import React, { useState } from "react";
import axios from "axios";

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

  const handleCodeChange = (e) => {
    setLicenseCode(e.target.value);
  };

  const fetchLicenseDetails = async () => {
    if (!licenseCode.trim()) {
      setError("Please enter a valid license code.");
      return;
    }

    setError(""); // Clear previous errors

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/licenses/validate",
        { licenseCode },
        { headers: { "Content-Type": "application/json" } }
      );

      setForm(data);
    } catch (error) {
      console.error("Validation Error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message ||
          "Invalid License Code. Please check and try again."
      );
    }
  };

  return (
    <div className="container mt-5">
      <h2>License Dashboard</h2>

      <div className="mt-4">
        <h4>Enter License Code</h4>
        <input
          type="text"
          value={licenseCode}
          onChange={handleCodeChange}
          placeholder="Enter License Code"
        />
        <button onClick={fetchLicenseDetails}>Fetch Details</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <h4>License Details</h4>
      <input
        type="text"
        value={form.OrganizationName}
        placeholder="Organization Name"
        readOnly
      />
      <input
        type="text"
        value={form.PurchaseDate}
        placeholder="Purchase Date"
        readOnly
      />
      <input
        type="text"
        value={form.ExpiryDate}
        placeholder="Expiry Date"
        readOnly
      />
      <input
        type="number"
        value={form.Quantity}
        placeholder="Quantity"
        readOnly
      />
      <input
        type="text"
        value={form.PartnerName}
        placeholder="Partner Name"
        readOnly
      />
    </div>
  );
};

export default LicenseDashboard;

// import React, { useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const LicenseDashboard = () => {
//   const [form, setForm] = useState({
//     licenseCode: "",
//     organizationName: "",
//     purchaseDate: "",
//     expiryDate: "",
//     quantity: "",
//     partnerName: "",
//   });
//   const [decoded, setDecoded] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Decode the 16-digit code and auto-fill form fields
//   const handleDecode = async (e) => {
//     e.preventDefault();
//     if (form.licenseCode.length !== 16) {
//       alert("License code must be 16 characters.");
//       return;
//     }
//     try {
//       const { data } = await axios.post(
//         "http://localhost:5000/api/licenses/decode",
//         { licenseCode: form.licenseCode }
//       );
//       setForm({
//         ...form,
//         organizationName: data.organizationName,
//         purchaseDate: data.purchaseDate,
//         expiryDate: data.expiryDate, // Expiry date auto-fills
//         quantity: data.quantity,
//         partnerName: data.partnerName,
//       });
//       setDecoded(true);
//     } catch (error) {
//       console.error("Error decoding license code:", error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>License Dashboard</h2>
//       <form onSubmit={handleDecode} className="mb-4">
//         <div className="row g-3">
//           <div className="col-md-4">
//             <input
//               type="text"
//               name="licenseCode"
//               className="form-control"
//               placeholder="Enter 16-digit License Code"
//               value={form.licenseCode}
//               onChange={handleChange}
//               maxLength="16"
//               required
//             />
//           </div>
//           <div className="col-md-2">
//             <button type="submit" className="btn btn-secondary">
//               Decode Code
//             </button>
//           </div>
//         </div>
//       </form>

//       {decoded && (
//         <form>
//           <div className="row g-3">
//             <div className="col-md-3">
//               <input
//                 type="text"
//                 name="organizationName"
//                 className="form-control"
//                 placeholder="Organization Name"
//                 value={form.organizationName}
//                 readOnly
//               />
//             </div>
//             <div className="col-md-3">
//               <input
//                 type="text"
//                 name="purchaseDate"
//                 className="form-control"
//                 placeholder="Purchase Date (YYYY-MM-DD)"
//                 value={form.purchaseDate}
//                 readOnly
//               />
//             </div>
//             <div className="col-md-3">
//               <input
//                 type="text"
//                 name="expiryDate"
//                 className="form-control"
//                 placeholder="Expiry Date (YYYY-MM-DD)"
//                 value={form.expiryDate}
//                 readOnly
//               />
//             </div>
//             <div className="col-md-3">
//               <input
//                 type="number"
//                 name="quantity"
//                 className="form-control"
//                 placeholder="Quantity"
//                 value={form.quantity}
//                 readOnly
//               />
//             </div>
//             <div className="col-md-3">
//               <input
//                 type="text"
//                 name="partnerName"
//                 className="form-control"
//                 placeholder="Partner Name"
//                 value={form.partnerName}
//                 readOnly
//               />
//             </div>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// };

// export default LicenseDashboard;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "bootstrap/dist/css/bootstrap.min.css";

// const LicenseDashboard = () => {
//   const [licenses, setLicenses] = useState([]);
//   const [form, setForm] = useState({
//     LicenseName: "",
//     PurchaseDate: "",
//     ExpiryDate: "",
//     Quantity: "",
//     AllocatedLicenses: "",
//     DeallocatedLicenses: "",
//   });

//   useEffect(() => {
//     fetchLicenses();
//   }, []);

//   // Fetch all licenses
//   const fetchLicenses = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:5000/api/licenses");
//       setLicenses(data);
//     } catch (error) {
//       console.error("Error fetching licenses:", error);
//     }
//   };

//   // Handle form input changes
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Handle form submission (Add License)
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/licenses", form);
//       setForm({
//         LicenseName: "",
//         PurchaseDate: "",
//         ExpiryDate: "",
//         Quantity: "",
//         AllocatedLicenses: "",
//         DeallocatedLicenses: "",
//       });
//       fetchLicenses();
//     } catch (error) {
//       console.error("Error creating license:", error);
//     }
//   };

//   // Delete a license entry
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/licenses/${id}`);
//       fetchLicenses();
//     } catch (error) {
//       console.error("Error deleting license:", error);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">License Management</h2>
//       <h4>Total Licenses: {licenses.length}</h4>

//       {/* License Form */}
//       <form onSubmit={handleSubmit} className="mb-4">
//         <div className="row g-3">
//           <div className="col-md-2">
//             <input
//               type="text"
//               name="LicenseName"
//               className="form-control"
//               placeholder="License Code"
//               value={form.LicenseName}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               type="date"
//               name="PurchaseDate"
//               className="form-control"
//               value={form.PurchaseDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               type="date"
//               name="ExpiryDate"
//               className="form-control"
//               value={form.ExpiryDate}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               type="number"
//               name="Quantity"
//               className="form-control"
//               placeholder="Quantity"
//               value={form.Quantity}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               type="number"
//               name="AllocatedLicenses"
//               className="form-control"
//               placeholder="Allocated Licenses"
//               value={form.AllocatedLicenses}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-2">
//             <input
//               type="number"
//               name="DeallocatedLicenses"
//               className="form-control"
//               placeholder="Deallocated Licenses"
//               value={form.DeallocatedLicenses}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div className="col-md-1">
//             <button type="submit" className="btn btn-primary">
//               Add
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* License Table */}
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>License Name</th>
//             <th>Purchase Date</th>
//             <th>Expiry Date</th>
//             <th>Quantity</th>
//             <th>Allocated</th>
//             <th>Deallocated</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {licenses.map((license) => (
//             <tr key={license.LicenseID}>
//               <td>{license.LicenseID}</td>
//               <td>{license.LicenseName}</td>
//               <td>{license.PurchaseDate}</td>
//               <td>{license.ExpiryDate}</td>
//               <td>{license.Quantity}</td>
//               <td>{license.AllocatedLicenses}</td>
//               <td>{license.DeallocatedLicenses}</td>
//               <td>
//                 <button className="btn btn-warning btn-sm me-2" disabled>
//                   Edit
//                 </button>
//                 <button
//                   className="btn btn-danger btn-sm"
//                   onClick={() => handleDelete(license.LicenseID)}
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default LicenseDashboard;
