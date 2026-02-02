import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./recentVisits.css";
import ConditionAdviceModal from "./ConditionAdviceModal";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const RecentVisitsPage = () => {
  const [activeTab, setActiveTab] = useState("Recent Visits");
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedVitals, setSelectedVitals] = useState(null);
  const [visitsData, setVisitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // AI Advice Modal State
  const [isAdviceModalOpen, setIsAdviceModalOpen] = useState(false);
  const [adviceCondition, setAdviceCondition] = useState("");
  const [adviceText, setAdviceText] = useState("");
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceError, setAdviceError] = useState("");

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

  const fetchAdvice = async (condition) => {
    if (!condition || condition === "None") return;

    setAdviceCondition(condition);
    setIsAdviceModalOpen(true);
    setAdviceLoading(true);
    setAdviceError("");
    setAdviceText("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/condition-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ condition }),
      });

      const data = await response.json();

      if (data.success) {
        setAdviceText(data.advice);
      } else {
        setAdviceError(data.message || "Failed to get advice.");
      }
    } catch (err) {
      console.error("Error fetching advice:", err);
      setAdviceError("Error connecting to AI service.");
    } finally {
      setAdviceLoading(false);
    }
  };

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
                  <strong>Condition: </strong>
                  <button
                    className="condition-link"
                    onClick={() => fetchAdvice(mostRecentVisit.clinicalSummary.diagnosis)}
                    title="Click for diet and exercise advice"
                    style={{ textDecoration: 'underline', cursor: 'pointer', color: '#007bff', background: 'none', border: 'none', padding: 0, fontSize: 'inherit', fontWeight: 'bold' }}
                  >
                    {mostRecentVisit.clinicalSummary.diagnosis}
                  </button>
                </div>
              </div>

              <div className="clinical-summary">
                <p><strong>Chief Complaints:</strong> {mostRecentVisit.clinicalSummary.chiefComplaints}</p>
                <div className="record-field-row" style={{ marginBottom: '10px' }}>
                  <strong>Diagnosis: </strong>
                  <span
                    onClick={() => fetchAdvice(mostRecentVisit.clinicalSummary.diagnosis)}
                    style={{ color: '#1976d2', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                  >
                    {mostRecentVisit.clinicalSummary.diagnosis}
                  </span>
                </div>
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

                  <div className="record-field-row" style={{ marginBottom: '10px' }}>
                    <strong>Diagnosis: </strong>
                    <span
                      onClick={() => fetchAdvice(visit.clinicalSummary.diagnosis)}
                      style={{ color: '#1976d2', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                    >
                      {visit.clinicalSummary.diagnosis}
                    </span>
                  </div>

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

      {/* Advice Modal */}
      <ConditionAdviceModal
        isOpen={isAdviceModalOpen}
        onClose={() => setIsAdviceModalOpen(false)}
        condition={adviceCondition}
        advice={adviceText}
        loading={adviceLoading}
        error={adviceError}
      />
    </div>
  );
};

export default RecentVisitsPage;
