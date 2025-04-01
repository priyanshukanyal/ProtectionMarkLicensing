import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Table, Button, Form } from "react-bootstrap";

const DeviceList = () => {
  const [allocatedDevices, setAllocatedDevices] = useState([]);
  const [deallocatedDevices, setDeallocatedDevices] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [selectedLicense, setSelectedLicense] = useState("");
  const [selectedLicenseDetails, setSelectedLicenseDetails] = useState(null);
  const [error, setError] = useState(null);

  // Fetch Licenses Initially
  useEffect(() => {
    fetchLicenses();
  }, []);

  // Fetch Devices when license is selected
  useEffect(() => {
    if (selectedLicense) {
      fetchDevices();
    }
  }, [selectedLicense]);

  // Fetch Devices API
  const fetchDevices = async () => {
    try {
      const [allocatedRes, deallocatedRes] = await Promise.all([
        axios.get(
          `http://localhost:5000/api/devices/allocated?allocated=1&licenseId=${selectedLicense}`
        ),
        axios.get(
          `http://localhost:5000/api/devices/allocated?allocated=0&licenseId=${selectedLicense}`
        ),
      ]);

      setAllocatedDevices(allocatedRes.data?.devices || []);
      setDeallocatedDevices(deallocatedRes.data?.devices || []);
    } catch (error) {
      console.error(
        "Error fetching devices:",
        error.response?.data || error.message
      );
      alert("Failed to fetch devices. Check the console for details.");
    }
  };

  // Fetch Licenses API
  const fetchLicenses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/licenses");
      setLicenses(response.data?.data || []);
    } catch (error) {
      setError("Failed to fetch licenses.");
    }
  };

  // Handle License Dropdown Change
  const handleLicenseChange = (licenseId) => {
    setSelectedLicense(licenseId);
    const license = licenses.find((lic) => lic.LicenseID === Number(licenseId));
    setSelectedLicenseDetails(license || null);
  };

  // ✅ Allocate License
  const allocateLicense = async (device) => {
    if (!selectedLicense) return alert("Please select a license first.");

    const licenseId = parseInt(selectedLicense, 10); // lower-case 'licenseId'
    const deviceId = device.DeviceID || device.DeviceId; // handle both cases

    console.log("licenseId:", licenseId);
    console.log("deviceId:", deviceId);
    console.log("Device Object:", device);

    if (!licenseId || !deviceId) return alert("Invalid License or Device ID");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/licenses/allocate",
        {
          licenseId, // ✅ send in correct key
          deviceId, // ✅ send in correct key
        }
      );

      console.log(res.data);
      updateLicenseStats(1);
      fetchDevices();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Failed to allocate license.");
    }
  };

  // Deallocate License
  const deallocateLicense = async (deviceId, licenseId) => {
    try {
      console.log("🚀 Attempting to deallocate license", {
        deviceId,
        licenseId,
      });

      if (!licenseId || !deviceId) {
        console.error("❌ Missing licenseId or deviceId!", {
          licenseId,
          deviceId,
        });
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/licenses/deallocate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deviceId, licenseId }),
        }
      );

      const data = await response.json();
      console.log("✅ Server Response:", data);

      if (!data.success) {
        throw new Error(data.message);
      }

      alert("License deallocated successfully!");
    } catch (error) {
      console.error("❌ Error deallocating license:", error.message);
    }
  };

  // Update License Counter in UI
  const updateLicenseStats = (change) => {
    setSelectedLicenseDetails((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        AllocatedLicenses: prev.AllocatedLicenses + change,
      };
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Device Management</h2>

      {/* License Selection */}
      <Card className="p-3 shadow-sm">
        <h5>Select a License</h5>
        <Form.Select
          onChange={(e) => handleLicenseChange(e.target.value)}
          value={selectedLicense}
          className="mb-3"
        >
          <option value="">-- Select License --</option>
          {licenses.map((license) => (
            <option key={license.LicenseID} value={license.LicenseID}>
              {license.LicenseName} (Available:{" "}
              {license.Quantity - license.AllocatedLicenses})
            </option>
          ))}
        </Form.Select>
      </Card>

      {/* License Stats */}
      {selectedLicenseDetails && (
        <Card className="mt-3 p-3 shadow-sm">
          <h5>{selectedLicenseDetails.LicenseName} - License Details</h5>
          <p>
            <strong>Total:</strong> {selectedLicenseDetails.Quantity}
          </p>
          <p>
            <strong>Allocated:</strong>{" "}
            {selectedLicenseDetails.AllocatedLicenses}
          </p>
          <p>
            <strong>Available:</strong>{" "}
            {selectedLicenseDetails.DeallocatedLicenses}
          </p>
        </Card>
      )}

      {/* Device Columns */}
      <div className="row mt-4">
        {/* Allocated Devices */}
        <div className="col-md-6">
          <Card className="shadow-sm">
            <Card.Header className="bg-success text-white">
              Allocated Devices
            </Card.Header>
            <Card.Body>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Device Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allocatedDevices.length > 0 ? (
                    allocatedDevices.map((device) => (
                      <tr key={device.DeviceID}>
                        <td>{device.DeviceName}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              deallocateLicense(
                                device.DeviceID,
                                device.LicenseID
                              )
                            }
                          >
                            Deallocate
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No allocated devices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>

        {/* Deallocated Devices */}
        <div className="col-md-6">
          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark">
              Deallocated Devices
            </Card.Header>
            <Card.Body>
              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Device Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deallocatedDevices.length > 0 ? (
                    deallocatedDevices.map((device) => (
                      <tr key={device.DeviceID}>
                        <td>{device.DeviceName}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => allocateLicense(device)}
                          >
                            Allocate
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center">
                        No deallocated devices found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeviceList;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const DeviceList = () => {
//   const [devices, setDevices] = useState([]);
//   const [licenses, setLicenses] = useState([]);
//   const [selectedLicense, setSelectedLicense] = useState("");
//   const [selectedLicenseDetails, setSelectedLicenseDetails] = useState(null);
//   const [allocatedDevices, setAllocatedDevices] = useState([]);
//   const [deallocatedDevices, setDeallocatedDevices] = useState([]);
//   const [loading, setLoading] = useState({ devices: false, licenses: false });
//   const [error, setError] = useState({ devices: null, licenses: null });

//   useEffect(() => {
//     const fetchDevices = async () => {
//       setLoading((prev) => ({ ...prev, devices: true }));
//       setError((prev) => ({ ...prev, devices: null }));
//       try {
//         const response = await axios.get("http://localhost:5000/api/devices");
//         // Ensure the response contains an array of devices
//         if (response.data && Array.isArray(response.data.data)) {
//           setDevices(response.data.data); // Use the `data` property
//         } else {
//           console.error("Expected an array but got:", response.data);
//           setDevices([]); // Fallback to empty array
//         }
//       } catch (error) {
//         setError((prev) => ({ ...prev, devices: "Failed to fetch devices." }));
//         console.error("Error fetching devices:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, devices: false }));
//       }
//     };
//     fetchDevices();
//   }, []);

//   // 🔹 Fetch all licenses
//   useEffect(() => {
//     const fetchLicenses = async () => {
//       setLoading((prev) => ({ ...prev, licenses: true }));
//       setError((prev) => ({ ...prev, licenses: null }));
//       try {
//         const response = await axios.get("http://localhost:5000/api/licenses");
//         console.log("Licenses response:", response.data); // Debugging

//         // Extract the `data` property from the response
//         if (response.data && Array.isArray(response.data.data)) {
//           setLicenses(response.data.data); // Use the `data` property
//         } else {
//           console.error("Expected an array but got:", response.data);
//           setLicenses([]); // Fallback to empty array
//         }
//       } catch (error) {
//         setError((prev) => ({
//           ...prev,
//           licenses: "Failed to fetch licenses.",
//         }));
//         console.error("Error fetching licenses:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, licenses: false }));
//       }
//     };
//     fetchLicenses();
//   }, []);

//   // 🔄 Handle license selection
//   const handleLicenseChange = (licenseId) => {
//     setSelectedLicense(licenseId);
//     if (licenseId) {
//       const license = licenses.find(
//         (lic) => lic.LicenseID === Number(licenseId)
//       );
//       setSelectedLicenseDetails(license || null);
//       fetchAllocatedDevices(licenseId);
//     } else {
//       setSelectedLicenseDetails(null);
//       setAllocatedDevices([]);
//       setDeallocatedDevices([]);
//     }
//   };

//   // 🔹 Fetch allocated devices for selected license
//   const fetchAllocatedDevices = async (licenseId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/licenses/${licenseId}`
//       );
//       const allocated = response.data?.AllocatedDevices || [];
//       setAllocatedDevices(allocated);
//       setDeallocatedDevices(
//         devices.filter(
//           (d) => !allocated.some((ad) => ad.DeviceID === d.DeviceID)
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching allocated devices:", error);
//       alert("Failed to fetch allocated devices.");
//     }
//   };

//   // ✅ Allocate a license to a device
//   const allocateLicense = async (device) => {
//     if (!selectedLicense) {
//       alert("Please select a license first.");
//       return;
//     }

//     if (allocatedDevices.some((d) => d.DeviceID === device.DeviceID)) {
//       alert("Device is already allocated!");
//       return;
//     }

//     if (
//       selectedLicenseDetails?.AllocatedLicenses >=
//       selectedLicenseDetails?.Quantity
//     ) {
//       alert("Allocation failed! You have exceeded the available quantity.");
//       return;
//     }

//     try {
//       const payload = {
//         licenseId: parseInt(selectedLicense, 10), // Parse licenseId as integer
//         deviceId: device.DeviceID,
//       };
//       console.log("Request Payload:", payload); // Log the payload

//       const response = await axios.post(
//         "http://localhost:5000/api/licenses/allocate",
//         payload
//       );
//       alert(response.data.message);
//       updateLicenseStats(1);
//       moveDevice(device, "allocate");
//     } catch (error) {
//       console.error(
//         "Error allocating license:",
//         error.response?.data || error.message
//       );
//       alert("Failed to allocate license. Check the console for details.");
//     }
//   };

//   // ✅ Deallocate a license from a device
//   const deallocateLicense = async (device) => {
//     if (!selectedLicense) {
//       alert("Please select a license first.");
//       return;
//     }

//     if (!allocatedDevices.some((d) => d.DeviceID === device.DeviceID)) {
//       alert("Device is not allocated!");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/licenses/deallocate",
//         {
//           licenseId: selectedLicense,
//           deviceId: device.DeviceID,
//         }
//       );
//       alert(response.data.message);
//       updateLicenseStats(-1);
//       moveDevice(device, "deallocate");
//     } catch (error) {
//       console.error("Error deallocating license:", error);
//       alert("Failed to deallocate license.");
//     }
//   };

//   // 🔄 Update license stats
//   const updateLicenseStats = (change) => {
//     setSelectedLicenseDetails((prev) => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         AllocatedLicenses: prev.AllocatedLicenses + change,
//         DeallocatedLicenses: prev.DeallocatedLicenses - change,
//       };
//     });
//   };

//   // 🔄 Move device between allocated and deallocated lists
//   const moveDevice = (device, action) => {
//     if (action === "allocate") {
//       setAllocatedDevices((prev) => [...prev, device]);
//       setDeallocatedDevices((prev) =>
//         prev.filter((d) => d.DeviceID !== device.DeviceID)
//       );
//     } else {
//       setDeallocatedDevices((prev) => [...prev, device]);
//       setAllocatedDevices((prev) =>
//         prev.filter((d) => d.DeviceID !== device.DeviceID)
//       );
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Device Management</h2>

//       {/* Loading and Error States */}
//       {loading.devices && <p>Loading devices...</p>}
//       {error.devices && <p style={{ color: "red" }}>{error.devices}</p>}
//       {loading.licenses && <p>Loading licenses...</p>}
//       {error.licenses && <p style={{ color: "red" }}>{error.licenses}</p>}

//       {/* License Selection */}
//       <div>
//         <label>Select License:</label>
//         <select onChange={(e) => handleLicenseChange(e.target.value)}>
//           <option value="">-- Select License --</option>
//           {Array.isArray(licenses) &&
//             licenses.map((license) => (
//               <option key={license.LicenseID} value={license.LicenseID}>
//                 {license.LicenseName} (Available:{" "}
//                 {license.Quantity - license.AllocatedLicenses})
//               </option>
//             ))}
//         </select>
//       </div>

//       {/* Selected License Stats */}
//       {selectedLicenseDetails && (
//         <div className="license-stats">
//           <h3>Selected License: {selectedLicenseDetails.LicenseName}</h3>
//           <p>
//             <strong>Total Quantity:</strong> {selectedLicenseDetails.Quantity}
//           </p>
//           <p>
//             <strong>Allocated:</strong> {allocatedDevices.length}
//           </p>
//           <p>
//             <strong>Deallocated:</strong>{" "}
//             {selectedLicenseDetails.DeallocatedLicenses}
//           </p>
//         </div>
//       )}

//       {/* Device Columns */}
//       <div className="device-columns" style={{ display: "flex", gap: "20px" }}>
//         {/* Allocated Devices */}
//         <div className="allocated-devices" style={{ width: "50%" }}>
//           <h3>Allocated Devices</h3>
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Device Name</th>
//                 <th>IP Address</th>
//                 <th>MAC Address</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allocatedDevices.map((device) => (
//                 <tr key={device.DeviceID}>
//                   <td>{device.DeviceName}</td>
//                   <td>{device.IPAddress}</td>
//                   <td>{device.MACAddress}</td>
//                   <td>
//                     <button onClick={() => deallocateLicense(device)}>
//                       Deallocate
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Deallocated Devices */}
//         <div className="deallocated-devices" style={{ width: "50%" }}>
//           <h3>Deallocated Devices</h3>
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Device Name</th>
//                 <th>IP Address</th>
//                 <th>MAC Address</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {deallocatedDevices.map((device) => (
//                 <tr key={device.DeviceID}>
//                   <td>{device.DeviceName}</td>
//                   <td>{device.IPAddress}</td>
//                   <td>{device.MACAddress}</td>
//                   <td>
//                     <button onClick={() => allocateLicense(device)}>
//                       Allocate
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeviceList;
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const DeviceList = () => {
//   const [devices, setDevices] = useState([]);
//   const [licenses, setLicenses] = useState([]);
//   const [selectedLicense, setSelectedLicense] = useState("");
//   const [selectedLicenseDetails, setSelectedLicenseDetails] = useState(null);
//   const [allocatedDevices, setAllocatedDevices] = useState([]);
//   const [deallocatedDevices, setDeallocatedDevices] = useState([]);
//   const [loading, setLoading] = useState({ devices: false, licenses: false });
//   const [error, setError] = useState({ devices: null, licenses: null });

//   // 🔹 Fetch all devices
//   useEffect(() => {
//     const fetchDevices = async () => {
//       setLoading((prev) => ({ ...prev, devices: true }));
//       setError((prev) => ({ ...prev, devices: null }));
//       try {
//         const response = await axios.get("http://localhost:5000/api/devices");
//         setDevices(response.data || []);
//       } catch (error) {
//         setError((prev) => ({ ...prev, devices: "Failed to fetch devices." }));
//         console.error("Error fetching devices:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, devices: false }));
//       }
//     };
//     fetchDevices();
//   }, []);

//   // 🔹 Fetch all licenses
//   useEffect(() => {
//     const fetchLicenses = async () => {
//       setLoading((prev) => ({ ...prev, licenses: true }));
//       setError((prev) => ({ ...prev, licenses: null }));
//       try {
//         const response = await axios.get("http://localhost:5000/api/licenses");
//         setLicenses(response.data || []);
//       } catch (error) {
//         setError((prev) => ({
//           ...prev,
//           licenses: "Failed to fetch licenses.",
//         }));
//         console.error("Error fetching licenses:", error);
//       } finally {
//         setLoading((prev) => ({ ...prev, licenses: false }));
//       }
//     };
//     fetchLicenses();
//   }, []);

//   // 🔄 Handle license selection
//   const handleLicenseChange = (licenseId) => {
//     setSelectedLicense(licenseId);
//     if (licenseId) {
//       const license = licenses.find(
//         (lic) => lic.LicenseID === Number(licenseId)
//       );
//       setSelectedLicenseDetails(license || null);
//       fetchAllocatedDevices(licenseId);
//     } else {
//       setSelectedLicenseDetails(null);
//       setAllocatedDevices([]);
//       setDeallocatedDevices([]);
//     }
//   };

//   // 🔹 Fetch allocated devices for selected license
//   const fetchAllocatedDevices = async (licenseId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/licenses/${licenseId}`
//       );
//       const allocated = response.data?.AllocatedDevices || [];
//       setAllocatedDevices(allocated);
//       setDeallocatedDevices(
//         devices.filter(
//           (d) => !allocated.some((ad) => ad.DeviceID === d.DeviceID)
//         )
//       );
//     } catch (error) {
//       console.error("Error fetching allocated devices:", error);
//       alert("Failed to fetch allocated devices.");
//     }
//   };

//   // ✅ Allocate a license to a device
//   const allocateLicense = async (device) => {
//     if (!selectedLicense) {
//       alert("Please select a license first.");
//       return;
//     }

//     if (allocatedDevices.some((d) => d.DeviceID === device.DeviceID)) {
//       alert("Device is already allocated!");
//       return;
//     }

//     if (
//       selectedLicenseDetails?.AllocatedLicenses >=
//       selectedLicenseDetails?.Quantity
//     ) {
//       alert("Allocation failed! You have exceeded the available quantity.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/licenses/allocate",
//         {
//           licenseId: selectedLicense,
//           deviceId: device.DeviceID,
//         }
//       );
//       alert(response.data.message);
//       updateLicenseStats(1);
//       moveDevice(device, "allocate");
//     } catch (error) {
//       console.error("Error allocating license:", error);
//       alert("Failed to allocate license.");
//     }
//   };

//   // ✅ Deallocate a license from a device
//   const deallocateLicense = async (device) => {
//     if (!selectedLicense) {
//       alert("Please select a license first.");
//       return;
//     }

//     if (!allocatedDevices.some((d) => d.DeviceID === device.DeviceID)) {
//       alert("Device is not allocated!");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/licenses/deallocate",
//         {
//           licenseId: selectedLicense,
//           deviceId: device.DeviceID,
//         }
//       );
//       alert(response.data.message);
//       updateLicenseStats(-1);
//       moveDevice(device, "deallocate");
//     } catch (error) {
//       console.error("Error deallocating license:", error);
//       alert("Failed to deallocate license.");
//     }
//   };

//   // 🔄 Update license stats
//   const updateLicenseStats = (change) => {
//     setSelectedLicenseDetails((prev) => {
//       if (!prev) return prev;
//       return {
//         ...prev,
//         AllocatedLicenses: prev.AllocatedLicenses + change,
//         DeallocatedLicenses: prev.DeallocatedLicenses - change,
//       };
//     });
//   };

//   // 🔄 Move device between allocated and deallocated lists
//   const moveDevice = (device, action) => {
//     if (action === "allocate") {
//       setAllocatedDevices((prev) => [...prev, device]);
//       setDeallocatedDevices((prev) =>
//         prev.filter((d) => d.DeviceID !== device.DeviceID)
//       );
//     } else {
//       setDeallocatedDevices((prev) => [...prev, device]);
//       setAllocatedDevices((prev) =>
//         prev.filter((d) => d.DeviceID !== device.DeviceID)
//       );
//     }
//   };

//   return (
//     <div className="container">
//       <h2>Device Management</h2>

//       {/* Loading and Error States */}
//       {loading.devices && <p>Loading devices...</p>}
//       {error.devices && <p style={{ color: "red" }}>{error.devices}</p>}
//       {loading.licenses && <p>Loading licenses...</p>}
//       {error.licenses && <p style={{ color: "red" }}>{error.licenses}</p>}

//       {/* License Selection */}
//       <div>
//         <label>Select License:</label>
//         <select onChange={(e) => handleLicenseChange(e.target.value)}>
//           <option value="">-- Select License --</option>
//           {Array.isArray(licenses) &&
//             licenses.map((license) => (
//               <option key={license.LicenseID} value={license.LicenseID}>
//                 {license.LicenseName} (Available:{" "}
//                 {license.Quantity - license.AllocatedLicenses})
//               </option>
//             ))}
//         </select>
//       </div>

//       {/* Selected License Stats */}
//       {selectedLicenseDetails && (
//         <div className="license-stats">
//           <h3>Selected License: {selectedLicenseDetails.LicenseName}</h3>
//           <p>
//             <strong>Total Quantity:</strong> {selectedLicenseDetails.Quantity}
//           </p>
//           <p>
//             <strong>Allocated:</strong> {allocatedDevices.length}
//           </p>
//           <p>
//             <strong>Deallocated:</strong>{" "}
//             {selectedLicenseDetails.DeallocatedLicenses}
//           </p>
//         </div>
//       )}

//       {/* Device Columns */}
//       <div className="device-columns" style={{ display: "flex", gap: "20px" }}>
//         {/* Allocated Devices */}
//         <div className="allocated-devices" style={{ width: "50%" }}>
//           <h3>Allocated Devices</h3>
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Device Name</th>
//                 <th>IP Address</th>
//                 <th>MAC Address</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allocatedDevices.map((device) => (
//                 <tr key={device.DeviceID}>
//                   <td>{device.DeviceName}</td>
//                   <td>{device.IPAddress}</td>
//                   <td>{device.MACAddress}</td>
//                   <td>
//                     <button onClick={() => deallocateLicense(device)}>
//                       Deallocate
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Deallocated Devices */}
//         <div className="deallocated-devices" style={{ width: "50%" }}>
//           <h3>Deallocated Devices</h3>
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Device Name</th>
//                 <th>IP Address</th>
//                 <th>MAC Address</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {deallocatedDevices.map((device) => (
//                 <tr key={device.DeviceID}>
//                   <td>{device.DeviceName}</td>
//                   <td>{device.IPAddress}</td>
//                   <td>{device.MACAddress}</td>
//                   <td>
//                     <button onClick={() => allocateLicense(device)}>
//                       Allocate
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeviceList;
