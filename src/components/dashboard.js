import React from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import "./dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [recentVisits, setRecentVisits] = React.useState([]);
  const [patientName, setPatientName] = React.useState("Patient");
  const patientId = localStorage.getItem("currentPatientId");
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  React.useEffect(() => {
    if (patientId) {
      // Fetch patient name
      fetch(`${API_BASE_URL}/api/patient-demographics/${patientId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data && json.data.name) {
            const { first, last } = json.data.name;
            setPatientName(`${first} ${last}`);
          }
        })
        .catch(err => console.error("Error fetching patient name:", err));

      // Fetch recent visits
      fetch(`${API_BASE_URL}/api/visits/${patientId}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.data.length > 0) {
            // Take the most recent visit
            const visit = json.data[0];
            setRecentVisits([{
              date: visit.appointment_date || new Date(visit.createdAt).toLocaleDateString(),
              doctor: visit.seen_by || "Unknown Doctor",
              purpose: visit.visit_type || "General Visit",
              visitIndex: 0
            }]);
          }
        })
        .catch(err => console.error("Error fetching dashboard visits:", err));
    }
  }, [patientId, API_BASE_URL]);

  return (
    <div className="dashboard-container">
      <div className="content-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
          />
        </div>
      </div>

      <p className="welcome-text">Welcome, {patientName}</p>

      <div className="content-grid">
        {/* Recent Visits */}
        <div className="recent-visits-section">
          <h2 className="section-title">Recent Visits</h2>
          <div className="visits-container">
            {recentVisits.map((visit, idx) => (
              <div className="visit-card" key={idx}>
                <div className="visit-info">
                  <div className="visit-label">Date of Visit:</div>
                  <div className="visit-value">{visit.date}</div>

                  <div className="visit-label">Doctor's Name:</div>
                  <div className="visit-value">{visit.doctor}</div>

                  <div className="visit-label">Purpose of Visit:</div>
                  <div className="visit-value">{visit.purpose}</div>
                </div>

                <button
                  className="view-more-btn"
                  onClick={() =>
                    navigate("/recent-visits", {
                      state: { openVitals: false, visitIndex: visit.visitIndex },
                    })
                  }
                >
                  View More
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
