import React, { useState, useEffect } from "react";
import "./appointments.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const AppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const patientId = localStorage.getItem("currentPatientId");

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!patientId) {
                setError("No patient selected");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/api/appointments/${patientId}`);
                const json = await response.json();

                if (json.success) {
                    setAppointments(json.data || []);
                } else {
                    setError("Failed to load appointments");
                }
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId]);

    if (loading) return (
        <div className="appointments-container">
            <div className="loading-spinner">Loading your schedule...</div>
        </div>
    );

    if (error) return (
        <div className="appointments-container">
            <div className="error-message">{error}</div>
        </div>
    );

    return (
        <div className="appointments-container">
            <div className="appointments-header">
                <h1 className="appointments-title">Upcoming Appointments</h1>
                <div className="appointment-count-badge">
                    {appointments.length} Total
                </div>
            </div>

            <p className="appointments-subtitle">Manage your upcoming visits and consultations</p>

            <div className="appointments-list">
                {appointments.length > 0 ? (
                    appointments.map((app, idx) => (
                        <div key={idx} className={`appointment-card ${app.urgency === "Yes" ? "urgent" : ""}`}>
                            <div className="card-header">
                                <span className="appointment-type">{app.appointment_type}</span>
                                <span className={`appointment-badge ${app.urgency === "Yes" ? "urgent" : ""}`}>
                                    {app.urgency === "Yes" ? "Urgent" : "Scheduled"}
                                </span>
                            </div>
                            <div className="card-body">
                                <div className="info-item">
                                    <span className="info-label">Doctor:</span>
                                    <span className="info-value">{app.doctor || "Medical Professional"}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Reason:</span>
                                    <span className="info-value">{app.reason_for_appointment}</span>
                                </div>
                                {app.comments && (
                                    <div className="info-item">
                                        <span className="info-label">Notes:</span>
                                        <span className="info-value">{app.comments}</span>
                                    </div>
                                )}
                                <div className="appointment-time-box">
                                    <div className="time-section">
                                        <span className="date-text">{app.appointment_date}</span>
                                        <span className="time-divider"></span>
                                        <span className="time-value">{app.appointment_time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-appointments">
                        <h3>No upcoming appointments</h3>
                        <p>You don't have any scheduled visits at this time.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppointmentsPage;
