import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./components/HomePage";
import HealthPage from "./components/Health/HealthPage";
import Settings from "./components/Settings/Settings";
import "bootstrap/dist/css/bootstrap.min.css";
import Report from "./components/Report/Report";
import Header from "./components/header";
import Login from "./components/Authentication/login";
import Signup from "./components/Authentication/signup";
import { AuthProvider, useAuth } from "./components/Authentication/AuthContext";
import LicenseDashboard from "./components/Licence/Licence";
import LicenseCodeGenerator from "./components/Licence/LicenseCodeGenerator";
import Policy from "./components/Policies/Policy";
import Device from "./components/Device/device";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<HomePage />} />} />
          <Route
            path="/add-device"
            element={<ProtectedRoute element={<Device />} />}
          />
          <Route
            path="/policy"
            element={<ProtectedRoute element={<Policy />} />}
          />
          <Route
            path="/health"
            element={<ProtectedRoute element={<HealthPage />} />}
          />
          <Route
            path="/licence"
            element={<ProtectedRoute element={<LicenseDashboard />} />}
          />
          <Route
            path="/report"
            element={<ProtectedRoute element={<Report />} />}
          />
          <Route
            path="/settings"
            element={<ProtectedRoute element={<Settings />} />}
          />
          <Route
            path="/license-generator"
            element={<ProtectedRoute element={<LicenseCodeGenerator />} />}
          />

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import HomePage from "./components/HomePage";
// import HealthPage from "./components/Health/HealthPage"; // Import HealthPage
// import Settings from "./components/Settings/Settings"; // Import Settings
// import "bootstrap/dist/css/bootstrap.min.css";
// import Report from "./components/Report/Report";
// import Header from "./components/header";
// import Login from "./components/Authentication/login";
// import Signup from "./components/Authentication/signup";
// import { AuthProvider } from "./components/Authentication/AuthContext";
// import LicenseDashboard from "./components/Licence/Licence";
// import LicenseCodeGenerator from "./components/Licence/LicenseCodeGenerator";
// import Policy from "./components/Policies/Policy";
// import Device from "./components/Device/device";

// const App = () => {
//   return (
//     <AuthProvider>
//       <Router>
//         <Header />
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/add-device" element={<Device />} />
//           <Route path="/policy" element={<Policy />} />
//           <Route path="/health" element={<HealthPage />} />
//           <Route path="/licence" element={<LicenseDashboard />} />
//           <Route path="/report" element={<Report />} />
//           <Route path="/settings" element={<Settings />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/license-generator" element={<LicenseCodeGenerator />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// };

// export default App;
