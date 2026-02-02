import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/dashboard";
import RecentVisitsPage from "./components/RecentVisitsPage";
import MedicalRecordsPage from "./components/MedicalRecordsPage";
import SettingsPage from "./components/SettingsPage";
import ProfileInfo from "./components/ProfileInfo";
import AccountSecurity from "./components/AccountSecurity";
import NotificationPreferences from "./components/NotificationPreferences";
import PrivacySettings from "./components/PrivacySettings";
import DataSharing from "./components/DataSharing";
import ConnectedDevices from "./components/ConnectedDevices";
import ChangePassword from "./components/ChangePassword";
import TwoFactorAuth from "./components/TwoFactorAuth";
import SecurityQuestions from "./components/SecurityQuestions";

// ✅ Import Support page
import Support from "./components/Support";
// ✅ Import ForgotPassword page
import ForgotPassword from "./components/ForgotPassword";
import AppointmentsPage from "./components/AppointmentsPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login route (no sidebar) */}
          <Route path="/" element={<Login />} />
          {/* Forgot Password route (no sidebar) */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* All other routes use Layout (with sidebar) */}
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="recent-visits" element={<RecentVisitsPage />} />
            <Route path="medical-records" element={<MedicalRecordsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />

            {/* Settings route with nested pages */}
            <Route path="settings" element={<SettingsPage />}>
              <Route index element={<ProfileInfo />} />
              <Route path="profile-info" element={<ProfileInfo />} />

              {/* ✅ Account Security with nested routes */}
              <Route path="account-security" element={<AccountSecurity />}>
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="two-factor" element={<TwoFactorAuth />} />
                <Route path="security-questions" element={<SecurityQuestions />} />
              </Route>

              <Route path="notification-preferences" element={<NotificationPreferences />} />
              <Route path="privacy-settings" element={<PrivacySettings />} />
              <Route path="data-sharing" element={<DataSharing />} />
              <Route path="connected-devices" element={<ConnectedDevices />} />

              {/* ✅ Support route under Settings */}
              <Route path="support" element={<Support />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
