import React, { useState } from "react";
import axios from "axios";

const LicenseCodeGenerator = ({ onCodeGenerated }) => {
  const [form, setForm] = useState({
    OrganizationName: "",
    PurchaseDate: "",
    Quantity: "",
    PartnerName: "",
  });
  const [generatedCode, setGeneratedCode] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      OrganizationName: form.OrganizationName,
      PurchaseDate: form.PurchaseDate,
      Quantity: form.Quantity,
      PartnerName: form.PartnerName,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/licenses/generate",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setGeneratedCode(data.licenseCode);

      if (onCodeGenerated) {
        onCodeGenerated(data.licenseCode);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Generate License Code</h4>
      <form onSubmit={handleSubmit} className="row g-3">
        <input
          type="text"
          name="OrganizationName"
          placeholder="Organization Name"
          value={form.OrganizationName}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="PurchaseDate"
          value={form.PurchaseDate}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="Quantity"
          placeholder="Quantity"
          value={form.Quantity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="PartnerName"
          placeholder="Partner Name"
          value={form.PartnerName}
          onChange={handleChange}
          required
        />
        <button type="submit">Generate Code</button>
      </form>
      {generatedCode && <h5>Generated Code: {generatedCode}</h5>}
    </div>
  );
};

export default LicenseCodeGenerator;
