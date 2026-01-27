import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./recentVisits.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const RecentVisitsPage = () => {
  const [activeTab, setActiveTab] = useState("Recent Visits");
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedVitals, setSelectedVitals] = useState(null);
  const [visitsData, setVisitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const location = useLocation();
  const patientId = localStorage.getItem("currentPatientId");

  useEffect(() => {
    const fetchVisits = async () => {
      if (!patientId) {
        setError("No patient selected");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/visits/${patientId}`);
        const json = await response.json();

        if (json.success) {
          const formattedVisits = json.data.map(visit => ({
            date: visit.appointment_date || new Date(visit.createdAt).toLocaleDateString(),
            purpose: visit.visit_type || "General Visit",
            doctor: visit.seen_by || "Unknown Doctor",
            clinicalSummary: {
              chiefComplaints: visit.chief_complaints || "Not recorded",
              diagnosis: visit.diagnosis?.full_icd10_list || visit.diagnosis?.icd10_quickest || "None",
              treatment: visit.treatment || "Not recorded",
              medicationHistory: visit.medication_history || [],
              investigationRequest: visit.investigation_request || "None",
              investigationResult: visit.investigation_result || "None",
              notes: visit.notes || "None"
            },
            vitals: {
              bloodPressure: visit.vitals?.blood_pressure || "N/A",
              pulseRate: visit.vitals?.pulse ? `${visit.vitals.pulse} bpm` : "N/A",
              respiratoryRate: visit.vitals?.respiratory_rate ? `${visit.vitals.respiratory_rate} bpm` : "N/A",
              temperature: visit.vitals?.temperature ? `${visit.vitals.temperature}°F` : "N/A",
              height: visit.vitals?.height ? `${visit.vitals.height} cm` : "N/A",
              weight: visit.vitals?.weight ? `${visit.vitals.weight} kg` : "N/A",
              spo2: visit.vitals?.oxygen_saturation ? `${visit.vitals.oxygen_saturation}%` : "N/A"
            }
          }));
          setVisitsData(formattedVisits);
        } else {
          setError("Failed to load visits");
        }
      } catch (err) {
        console.error("Error fetching visits:", err);
        setError("Error loading visits");
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [patientId]);

  useEffect(() => {
    if (location.state?.openVitals && location.state?.visitIndex !== null) {
      setActiveTab("Vitals");
      setSelectedVitals(location.state.visitIndex);
    }
  }, [location.state]);

  const mostRecentVisit = visitsData.length > 0 ? visitsData[0] : null;

  if (loading) return <div className="recent-visits-container">Loading visits...</div>;
  if (error) return <div className="recent-visits-container">{error}</div>;

  return (
    <div className="recent-visits-container">
      <div className="content-header">
        <h1 className="page-title">Recent Visits</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
          />
        </div>
      </div>

      <p className="welcome-text">Your recent medical visits</p>

      {/* Tabs */}
      <div className="tabs">
        {["Recent Visits", "Visit History", "Vitals"].map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "Recent Visits" ? (
        <>
          {mostRecentVisit ? (
            <>
              <div className="visit-details">
                <p><strong>Date of Visit:</strong> {mostRecentVisit.date}</p>
                <p><strong>Doctor's Name:</strong> {mostRecentVisit.doctor}</p>

                <div className="condition">
                  <button
                    className="condition-link"
                    onClick={() => console.log(`${mostRecentVisit.clinicalSummary.diagnosis} clicked`)}
                  >
                    {mostRecentVisit.clinicalSummary.diagnosis}
                  </button>
                </div>
              </div>

              <div className="clinical-summary">
                <p><strong>Chief Complaints:</strong> {mostRecentVisit.clinicalSummary.chiefComplaints}</p>
                <p><strong>Diagnosis:</strong> {mostRecentVisit.clinicalSummary.diagnosis}</p>
                <p><strong>Treatment:</strong> {mostRecentVisit.clinicalSummary.treatment}</p>

                <div className="medication-history-section">
                  <strong>Medication History:</strong>
                  {mostRecentVisit.clinicalSummary.medicationHistory.length > 0 ? (
                    <table className="medication-table">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mostRecentVisit.clinicalSummary.medicationHistory.map((med, index) => (
                          <tr key={index}>
                            <td>{med.medicine}</td>
                            <td>{med.dosage}mg</td>
                            <td>{med.frequency}</td>
                            <td>{med.duration}</td>
                            <td>{med.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <span> None</span>
                  )}
                </div>

                <p><strong>Investigation Request:</strong> {mostRecentVisit.clinicalSummary.investigationRequest}</p>
                <p><strong>Investigation Result:</strong> {mostRecentVisit.clinicalSummary.investigationResult}</p>
                <p><strong>Notes:</strong> {mostRecentVisit.clinicalSummary.notes}</p>
              </div>
            </>
          ) : (
            <p>No recent visits recorded.</p>
          )}
        </>
      ) : activeTab === "Visit History" ? (
        <div className="visit-history">
          {visitsData.map((visit, idx) => (
            <div key={idx} className="visit-item">
              <div className="visit-header">
                <p><strong>Purpose of Visit:</strong> {visit.purpose}</p>
                <p><strong>Doctor's Name:</strong> {visit.doctor}</p>
                <p className="visit-date">{visit.date}</p>
              </div>

              <div className="visit-actions">
                <button
                  className="vitals-btn"
                  onClick={() => {
                    setSelectedVitals(idx);
                    setActiveTab("Vitals");
                  }}
                >
                  Vitals
                </button>

                <button
                  className="vitals-btn"
                  onClick={() => setSelectedVisit(selectedVisit === idx ? null : idx)}
                >
                  Clinical Summary
                </button>
              </div>

              {selectedVisit === idx && (
                <div className="clinical-summary">
                  <p><strong>Chief Complaints:</strong> {visit.clinicalSummary.chiefComplaints}</p>
                  <p><strong>Diagnosis:</strong> {visit.clinicalSummary.diagnosis}</p>
                  <p><strong>Treatment:</strong> {visit.clinicalSummary.treatment}</p>

                  <div className="medication-history-section">
                    <strong>Medication History:</strong>
                    {visit.clinicalSummary.medicationHistory.length > 0 ? (
                      <table className="medication-table">
                        <thead>
                          <tr>
                            <th>Medicine</th>
                            <th>Dosage</th>
                            <th>Frequency</th>
                            <th>Duration</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visit.clinicalSummary.medicationHistory.map((med, index) => (
                            <tr key={index}>
                              <td>{med.medicine}</td>
                              <td>{med.dosage}mg</td>
                              <td>{med.frequency}</td>
                              <td>{med.duration}</td>
                              <td>{med.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <span> None</span>
                    )}
                  </div>

                  <p><strong>Investigation Request:</strong> {visit.clinicalSummary.investigationRequest}</p>
                  <p><strong>Investigation Result:</strong> {visit.clinicalSummary.investigationResult}</p>
                  <p><strong>Notes:</strong> {visit.clinicalSummary.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : activeTab === "Vitals" && selectedVitals !== null && visitsData[selectedVitals] ? (
        <div className="vitals-summary">
          <h2>Vitals for {visitsData[selectedVitals].date}</h2>
          <p><strong>Blood Pressure:</strong> {visitsData[selectedVitals].vitals.bloodPressure}</p>
          <p><strong>Pulse Rate:</strong> {visitsData[selectedVitals].vitals.pulseRate}</p>
          <p><strong>Respiratory Rate:</strong> {visitsData[selectedVitals].vitals.respiratoryRate}</p>
          <p><strong>Temperature:</strong> {visitsData[selectedVitals].vitals.temperature}</p>
          <p><strong>Height:</strong> {visitsData[selectedVitals].vitals.height}</p>
          <p><strong>Weight:</strong> {visitsData[selectedVitals].vitals.weight}</p>
          <p><strong>SpO₂:</strong> {visitsData[selectedVitals].vitals.spo2}</p>
        </div>
      ) : null}
    </div>
  );
};

export default RecentVisitsPage;
