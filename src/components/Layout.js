import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./layout.css";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Top blue band */}
      <div className="top-band">
        <button
          className="hamburger-menu"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
      </div>

      <div className="layout-content">
        <div className={`sidebar-container ${isSidebarOpen ? 'open' : ''}`}>
          <Sidebar />
          {/* Overlay to close sidebar on mobile when clicking outside */}
          <div
            className="sidebar-overlay"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        </div>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;