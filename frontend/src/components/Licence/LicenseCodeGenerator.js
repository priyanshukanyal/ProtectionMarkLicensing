import React, { useState } from "react";
import axios from "axios";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
  Card,
} from "react-bootstrap"; // Added Card

const LicenseCodeGenerator = ({ onCodeGenerated }) => {
  const [form, setForm] = useState({
    OrganizationName: "",
    PurchaseDate: "",
    Quantity: "",
    PartnerName: "",
  });

  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/licenses/generate",
        form,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Generated License Code:", data.licenseCode); // ✅ Log the generated license

      setGeneratedCode(data.licenseCode);
      if (onCodeGenerated) {
        onCodeGenerated(data.licenseCode);
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setError(
        error.response?.data?.message || "Failed to generate license code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h4 className="mb-3 text-center">Generate License Code</h4>

      <Card className="p-4 shadow-sm">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Organization Name</Form.Label>
                <Form.Control
                  type="text"
                  name="OrganizationName"
                  placeholder="Enter organization name"
                  value={form.OrganizationName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control
                  type="date"
                  name="PurchaseDate"
                  value={form.PurchaseDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="Quantity"
                  placeholder="Enter quantity"
                  value={form.Quantity}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>Partner Name</Form.Label>
                <Form.Control
                  type="text"
                  name="PartnerName"
                  placeholder="Enter partner name"
                  value={form.PartnerName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Generate Code"
            )}
          </Button>
        </Form>

        {error && (
          <Alert variant="danger" className="mt-3">
            {error}
          </Alert>
        )}
        {generatedCode && (
          <Alert variant="success" className="mt-3">
            <strong>Generated Code:</strong> {generatedCode}
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default LicenseCodeGenerator;
