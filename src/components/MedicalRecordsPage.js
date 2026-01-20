import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./medicalRecords.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const MedicalRecordsPage = () => {
  const [activeTab, setActiveTab] = useState("Current Records");
  const [records, setRecords] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const patientId = localStorage.getItem("currentPatientId");

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) {
        setError("No patient selected");
        setLoading(false);
        return;
      }

      try {
        // Fetch patient for profile info and allergies
        const patientRes = await fetch(`${API_BASE_URL}/api/patients/${patientId}/profile`);
        const patientJson = await patientRes.json();

        // Fetch visits for conditions and medications
        const visitsRes = await fetch(`${API_BASE_URL}/api/visits/${patientId}`);
        const visitsJson = await visitsRes.json();

        if (patientJson.success && visitsJson.success) {
          const profile = patientJson.data;
          setPatientData(profile);

          const patientAllergies = profile.allergies?.length > 0
            ? profile.allergies.map(a => `${a.allergen} (${a.reaction})`).join(", ")
            : "None";

          const formattedRecords = visitsJson.data.map((visit, index) => ({
            date: visit.appointment_date || new Date(visit.createdAt).toLocaleDateString(),
            purpose: visit.visit_type || "General Visit",
            chiefComplaints: visit.chief_complaints || "Not recorded",
            conditions: visit.diagnosis?.icd10_quickest || visit.diagnosis?.full_icd10_list || "None",
            medications: visit.medication_history?.length > 0
              ? visit.medication_history.map(m => `${m.medicine} ${m.dosage}mg`).join(", ")
              : "None",
            treatment: visit.treatment || "Not recorded",
            allergies: patientAllergies,
            recentAssessments: visit.notes || "No notes",
            visitIndex: index,
          }));

          setRecords(formattedRecords);
        } else {
          setError(patientJson.message || visitsJson.message || "Failed to load records");
        }
      } catch (err) {
        console.error("Error fetching medical records:", err);
        setError("Error loading medical records. Please check if the server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [patientId]);

  const currentRecords = records.slice(0, 3);
  const historicalRecords = records; // Show all records as requested

  const renderRecords = (recordsList) => {
    if (recordsList.length === 0) {
      return <div className="no-records">No records found.</div>;
    }

    return (
      <div className="medical-records-list">
        {recordsList.map((record, idx) => (
          <div key={idx} className="medical-record-item">
            <div className="record-content">
              <p><strong>Purpose:</strong> {record.purpose}</p>
              <p><strong>Chief Complaints:</strong> {record.chiefComplaints}</p>
              <p><strong>Conditions:</strong> {record.conditions}</p>
              <p><strong>Medications:</strong> {record.medications}</p>
              <p><strong>Treatment:</strong> {record.treatment}</p>
              <p><strong>Allergies:</strong> {record.allergies}</p>
              <p><strong>Recent Assessments:</strong> {record.recentAssessments}</p>

              <div className="vitals-below-content">
                {record.visitIndex !== null && (
                  <button
                    className="vitals-btn"
                    onClick={() =>
                      navigate("/recent-visits", {
                        state: { openVitals: true, visitIndex: record.visitIndex },
                      })
                    }
                  >
                    Vitals
                  </button>
                )}
              </div>
            </div>

            <div className="record-actions">
              <div className="record-date">{record.date}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) return <div className="medical-records-container">Loading records...</div>;
  if (error) return <div className="medical-records-container">{error}</div>;

  return (
    <div className="medical-records-container">
      <div className="content-header">
        <h1 className="page-title">Medical Records</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-box"
          />
        </div>
      </div>

      {patientData && patientData.demographics && (
        <div className="patient-summary-card">
          <h2>Patient Profile Summary</h2>
          <div className="summary-grid">
            <p><strong>Name:</strong> {patientData.demographics.name.first} {patientData.demographics.name.last}</p>
            <p><strong>DOB:</strong> {patientData.demographics.date_of_birth}</p>
            <p><strong>Gender:</strong> {patientData.demographics.gender}</p>
            <p><strong>Blood Group:</strong> {patientData.demographics.blood_group}</p>
            <p><strong>Occupation:</strong> {patientData.demographics.occupation}</p>
            <p><strong>Contact:</strong> {patientData.contact?.contact_info?.mobile?.code} {patientData.contact?.contact_info?.mobile?.number}</p>
          </div>
        </div>
      )}

      <div className="tabs">
        {["Current Records", "Historical Records"].map((tab) => (
          <div
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {activeTab === "Current Records"
        ? renderRecords(currentRecords)
        : renderRecords(historicalRecords)}
    </div>
  );
};

export default MedicalRecordsPage;