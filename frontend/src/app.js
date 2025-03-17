import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import HealthPage from "./components/Health/HealthPage"; // Import HealthPage
import Settings from "./components/Settings/Settings"; // Import Settings
import "bootstrap/dist/css/bootstrap.min.css";
import Report from "./components/Report/Report";
import Header from "./components/header";
import Login from "./components/Authentication/login";
import Signup from "./components/Authentication/signup";
import { AuthProvider } from "./components/Authentication/AuthContext";
import LicenseDashboard from "./components/Licence/Licence";
import LicenseCodeGenerator from "./components/Licence/LicenseCodeGenerator";
import Policy from "./components/Policies/Policy";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/licence" element={<LicenseDashboard />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/license-generator" element={<LicenseCodeGenerator />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
