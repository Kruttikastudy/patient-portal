import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidebar.css";
import logo from "../assets/icons/logo.png";
import dashboardIcon from "../assets/icons/dashboardIcon.png";
import visitsIcon from "../assets/icons/visitsIcon.png";
import recordsIcon from "../assets/icons/recordsIcon.png";
import billingIcon from "../assets/icons/billingIcon.png";
import settingsIcon from "../assets/icons/settingsIcon.png";
import logoutIcon from "../assets/icons/logoutIcon.png";
// Import your custom arrow icons
import arrowDownIcon from "../assets/icons/arrowDown.png"; // Add your down arrow icon
import arrowUpIcon from "../assets/icons/arrowUp.png";     // Add your up arrow icon
import "@fontsource-variable/bricolage-grotesque";


const Sidebar = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurityOptions, setShowSecurityOptions] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("currentPatientId");
      localStorage.removeItem("currentPatientName");
      window.location.href = "/";
    }
  };

  return (
    <div className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <img src={logo} alt="Logo" className="logo" />
        <div className="header-title">SSPD Patient Portal</div>
      </div>

      {/* Scrollable section */}
      <div className="sidebar-scroll">
        <div className="sidebar-content">
          {/* Main navigation */}
          {[
            { name: "Dashboard", path: "/dashboard", icon: dashboardIcon },
            { name: "Recent Visits", path: "/recent-visits", icon: visitsIcon },
            { name: "Medical Records", path: "/medical-records", icon: recordsIcon },
            { name: "Billing", path: "/billing", icon: billingIcon },
          ].map((item) => (
            <div
              key={item.name}
              className="nav-item"
              onClick={() => navigate(item.path)}
            >
              <div className="nav-item-content">
                <img src={item.icon} alt={item.name} className="nav-icon" />
                <div className="nav-text">{item.name}</div>
              </div>
            </div>
          ))}

          {/* Settings toggle */}
          <div
            className={`nav-item ${showSettings ? "active" : ""}`}
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className="nav-item-content">
              <img src={settingsIcon} alt="Settings" className="nav-icon" />
              <div className="nav-text">Settings</div>
              <img 
                src={showSettings ? arrowUpIcon : arrowDownIcon} 
                alt={showSettings ? "Collapse" : "Expand"} 
                className="toggle-arrow-icon"
              />
            </div>
          </div>

          {/* Settings subnav */}
          {showSettings && (
            <div className="settings-subnav">
              <div
                className="settings-nav-item"
                onClick={() => navigate("/settings/profile-info")}
              >
                <div className="nav-item-content">
                  <div className="nav-text">Profile Information</div>
                </div>
              </div>

              {/* Account Security */}
              <div className="account-security-container">
                <div
                  className="settings-nav-item"
                  onClick={() => setShowSecurityOptions(!showSecurityOptions)}
                >
                  <div className="nav-item-content">
                    <div className="nav-text">Account Security</div>
                    <img 
                      src={showSecurityOptions ? arrowUpIcon : arrowDownIcon} 
                      alt={showSecurityOptions ? "Collapse" : "Expand"} 
                      className="toggle-arrow-icon"
                    />
                  </div>
                </div>

                {showSecurityOptions && (
                  <div className="sub-options">
                    <div
                      className="settings-nav-item"
                      onClick={() =>
                        navigate("/settings/account-security/change-password")
                      }
                    >
                      <div className="nav-item-content">
                        <div className="nav-text">Change Password</div>
                      </div>
                    </div>
                    <div
                      className="settings-nav-item"
                      onClick={() =>
                        navigate("/settings/account-security/two-factor")
                      }
                    >
                      <div className="nav-item-content">
                        <div className="nav-text">Two-Factor Authentication</div>
                      </div>
                    </div>
                    <div
                      className="settings-nav-item"
                      onClick={() =>
                        navigate("/settings/account-security/security-questions")
                      }
                    >
                      <div className="nav-item-content">
                        <div className="nav-text">Security Questions</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Other settings */}
              <div
                className="settings-nav-item"
                onClick={() => navigate("/settings/notification-preferences")}
              >
                <div className="nav-item-content">
                  <div className="nav-text">Notification Preferences</div>
                </div>
              </div>

              <div
                className="settings-nav-item"
                onClick={() => navigate("/settings/privacy-settings")}
              >
                <div className="nav-item-content">
                  <div className="nav-text">Privacy Settings</div>
                </div>
              </div>

              <div
                className="settings-nav-item"
                onClick={() => navigate("/settings/data-sharing")}
              >
                <div className="nav-item-content">
                  <div className="nav-text">Data Sharing</div>
                </div>
              </div>

              <div
                className="settings-nav-item"
                onClick={() => navigate("/settings/connected-devices")}
              >
                <div className="nav-item-content">
                  <div className="nav-text">Connected Devices</div>
                </div>
              </div>

              <div
                className="settings-nav-item"
                onClick={() => navigate("/settings/support")}
              >
                <div className="nav-item-content">
                  <div className="nav-text">Support and Help</div>
                </div>
              </div>
            </div>
          )}

          {/* Logout button moved inside scrollable content */}
          <div className="nav-item logout-button" onClick={handleLogout}>
            <div className="nav-item-content">
              <img src={logoutIcon} alt="Logout" className="nav-icon" />
              <div className="nav-text">Logout</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;