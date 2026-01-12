import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import './profileInfo.css';

export default function ProfileInfo() {
  // protect against undefined outlet context
  const outlet = useOutletContext() || {};
  const {
    patientData = {},
    contactData = {},
    insuranceData = {}
  } = outlet;

  const navigate = useNavigate();
  const patientId = typeof window !== 'undefined' ? localStorage.getItem("currentPatientId") : null;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

  // State for fetching all data from backend
  const [patientDataLoaded, setPatientDataLoaded] = useState(patientData);
  const [contactDataLoaded, setContactDataLoaded] = useState(contactData);
  const [insuranceDataLoaded, setInsuranceDataLoaded] = useState(insuranceData);
  const [allergiesData, setAllergiesData] = useState([]);
  const [familyHistoryData, setFamilyHistoryData] = useState({ familyMembers: [], geneticConditions: [] });
  const [socialHistoryData, setSocialHistoryData] = useState(null);

  // Fetch allergies, family history, and social history data
  useEffect(() => {
    if (!patientId) return;

    const fetchData = async () => {
      try {
        // Fetch patient demographics
        const patientRes = await fetch(`${API_BASE_URL}/api/patient-demographics/${patientId}`);
        if (patientRes.ok) {
          const patientJson = await patientRes.json();
          if (patientJson.success && patientJson.data) {
            setPatientDataLoaded(patientJson.data);
          }
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }

      try {
        // Fetch contact information
        const contactRes = await fetch(`${API_BASE_URL}/api/contact-information/${patientId}`);
        if (contactRes.ok) {
          const contactJson = await contactRes.json();
          if (contactJson.success && contactJson.data) {
            setContactDataLoaded({
              contact_info: contactJson.data.contact_info,
              id: contactJson.data.id
            });
          }
        }
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }

      try {
        // Fetch insurance information
        const insuranceRes = await fetch(`${API_BASE_URL}/api/insurance/${patientId}`);
        if (insuranceRes.ok) {
          const insuranceJson = await insuranceRes.json();
          if (insuranceJson.insurance) {
            setInsuranceDataLoaded({
              insurance: insuranceJson.insurance,
              id: insuranceJson.patient_id
            });
          }
        }
      } catch (error) {
        console.error('Error fetching insurance data:', error);
      }

      try {
        // Fetch allergies
        const allergiesRes = await fetch(`${API_BASE_URL}/api/allergies/${patientId}`);
        if (allergiesRes.ok) {
          const allergiesJson = await allergiesRes.json();
          if (allergiesJson.success) {
            setAllergiesData(allergiesJson.data || []);
          }
        }
      } catch (error) {
        console.error('Error fetching allergies:', error);
      }

      try {
        // Fetch family history
        const familyHistoryRes = await fetch(`${API_BASE_URL}/api/family-history/${patientId}`);
        if (familyHistoryRes.ok) {
          const familyHistoryJson = await familyHistoryRes.json();
          if (familyHistoryJson.success) {
            setFamilyHistoryData(familyHistoryJson.data || { familyMembers: [], geneticConditions: [] });
          }
        }
      } catch (error) {
        console.error('Error fetching family history:', error);
      }

      try {
        // Fetch social history - tobacco smoking
        const tobaccoSmokingRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/tobacco-smoking`);
        const tobaccoConsumptionRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/tobacco-consumption`);
        const alcoholRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/alcohol`);
        const socialTextRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/social-text`);
        const financialRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/financial-resources`);
        const educationRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/education`);
        const physicalActivityRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/physical-activity`);
        const stressRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/stress`);
        const socialIsolationRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/social-isolation`);
        const exposureToViolenceRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/exposure-to-violence`);
        const genderIdentityRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/gender-identity`);
        const sexualOrientationRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/sexual-orientation`);
        const nutrientsRes = await fetch(`${API_BASE_URL}/api/social-history/${patientId}/nutrients-history`);

        const results = await Promise.all([
          tobaccoSmokingRes.ok ? tobaccoSmokingRes.json() : null,
          tobaccoConsumptionRes.ok ? tobaccoConsumptionRes.json() : null,
          alcoholRes.ok ? alcoholRes.json() : null,
          socialTextRes.ok ? socialTextRes.json() : null,
          financialRes.ok ? financialRes.json() : null,
          educationRes.ok ? educationRes.json() : null,
          physicalActivityRes.ok ? physicalActivityRes.json() : null,
          stressRes.ok ? stressRes.json() : null,
          socialIsolationRes.ok ? socialIsolationRes.json() : null,
          exposureToViolenceRes.ok ? exposureToViolenceRes.json() : null,
          genderIdentityRes.ok ? genderIdentityRes.json() : null,
          sexualOrientationRes.ok ? sexualOrientationRes.json() : null,
          nutrientsRes.ok ? nutrientsRes.json() : null
        ]);

        if (results.some(r => r && r.success)) {
          setSocialHistoryData({
            tobaccoSmoking: results[0]?.data,
            tobaccoConsumption: results[1]?.data,
            alcohol: results[2]?.data,
            socialText: results[3]?.data,
            financial: results[4]?.data,
            education: results[5]?.data,
            physicalActivity: results[6]?.data,
            stress: results[7]?.data,
            socialIsolation: results[8]?.data,
            exposureToViolence: results[9]?.data,
            genderIdentity: results[10]?.data,
            sexualOrientation: results[11]?.data,
            nutrients: results[12]?.data
          });
        }
      } catch (error) {
        console.error('Error fetching social history:', error);
      }
    };

    fetchData();
  }, [patientId, API_BASE_URL]);

  const handleNext = () => {
    navigate('/dashboard/consent');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="profile-section">
      <div className="profile-header">
        <h1 className="settings-title">Profile Information</h1>
      </div>

      {/* Demographics Section */}
      {(patientDataLoaded && Object.keys(patientDataLoaded).length > 0) || (patientData && Object.keys(patientData).length > 0) ? (
        <section className="demographics-section">
          <div className="section-header-container">
            <h3 className="section-header">Demographics</h3>
          </div>
          <div className="demographics-display">
            <div className="info-grid">
              {(() => {
                const data = patientDataLoaded || patientData;
                const firstName = data.name?.first || data.firstName;
                const middleName = data.name?.middle || data.middleName;
                const lastName = data.name?.last || data.lastName;
                const dob = data.date_of_birth || data.dob;
                const gender = data.gender;
                const bloodGroup = data.blood_group || data.bloodGroup;
                const occupation = data.occupation;
                const aadharNumber = data.aadhaar || data.aadharNumber;
                const panNumber = data.pan || data.panNumber;

                const address1 = data.address?.street || data.address1 || '';
                const city = data.address?.city || data.city || '';
                const postalCode = data.address?.postal_code || data.postalCode || '';
                const district = data.address?.district || data.district || '';
                const state = data.address?.state || data.state || '';
                const country = data.address?.country || data.country || '';

                return (
                  <>
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-value">
                        {[firstName, middleName, lastName].filter(Boolean).join(' ')}
                      </span>
                    </div>
                    {dob && (
                      <div className="info-row">
                        <span className="info-label">DOB:</span>
                        <span className="info-value">{formatDate(dob)}</span>
                      </div>
                    )}
                    {gender && (
                      <div className="info-row">
                        <span className="info-label">Gender:</span>
                        <span className="info-value">{gender}</span>
                      </div>
                    )}
                    {(address1 || city) && (
                      <div className="info-row">
                        <span className="info-label">Address:</span>
                        <span className="info-value">
                          {[address1, city, district, state, country, postalCode].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {bloodGroup && (
                      <div className="info-row">
                        <span className="info-label">Blood Group:</span>
                        <span className="info-value">{bloodGroup}</span>
                      </div>
                    )}
                    {occupation && (
                      <div className="info-row">
                        <span className="info-label">Occupation:</span>
                        <span className="info-value">{occupation}</span>
                      </div>
                    )}
                    {aadharNumber && (
                      <div className="info-row">
                        <span className="info-label">Aadhar No.:</span>
                        <span className="info-value">{aadharNumber}</span>
                      </div>
                    )}
                    {panNumber && (
                      <div className="info-row">
                        <span className="info-label">PAN No.:</span>
                        <span className="info-value">{panNumber}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      ) : null}

      {/* Contact Section */}
      {(contactDataLoaded && Object.keys(contactDataLoaded).length > 0) || (contactData && Object.keys(contactData).length > 0) ? (
        <section className="contact-section">
          <div className="section-header-container">
            <h3 className="section-header">Contact</h3>
          </div>
          <div className="contact-display">
            <div className="info-grid">
              {(() => {
                const data = contactDataLoaded || contactData;
                const mobilePhone = data.contact_info?.mobile ? `${data.contact_info.mobile.code || ''} ${data.contact_info.mobile.number || ''}`.trim() : data.mobilePhone;
                const homePhone = data.contact_info?.home_phone ? `${data.contact_info.home_phone.code || ''} ${data.contact_info.home_phone.number || ''}`.trim() : data.homePhone;
                const workPhone = data.contact_info?.work_phone ? `${data.contact_info.work_phone.code || ''} ${data.contact_info.work_phone.number || ''}`.trim() : data.workPhone;
                const email = data.contact_info?.email || data.email;

                const emergencyContact = data.contact_info?.emergency_contact?.[0] || data.emergencyContact;
                const emergencyFirstName = emergencyContact?.name?.first || data.emergencyFirstName;
                const emergencyMiddleName = emergencyContact?.name?.middle || data.emergencyMiddleName;
                const emergencyLastName = emergencyContact?.name?.last || data.emergencyLastName;
                const emergencyRelationship = emergencyContact?.relationship || data.emergencyRelationship;
                const emergencyPhone = emergencyContact?.phone ? `${emergencyContact.phone.code || ''} ${emergencyContact.phone.number || ''}`.trim() : data.emergencyPhone;
                const emergencyEmail = emergencyContact?.email || data.emergencyEmail;

                return (
                  <>
                    {mobilePhone && (
                      <div className="info-row">
                        <span className="info-label">Mobile:</span>
                        <span className="info-value">{mobilePhone}</span>
                      </div>
                    )}
                    {homePhone && (
                      <div className="info-row">
                        <span className="info-label">Home:</span>
                        <span className="info-value">{homePhone}</span>
                      </div>
                    )}
                    {workPhone && (
                      <div className="info-row">
                        <span className="info-label">Work:</span>
                        <span className="info-value">{workPhone}</span>
                      </div>
                    )}
                    {email && (
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{email}</span>
                      </div>
                    )}
                    {(emergencyFirstName || emergencyLastName) && (
                      <div className="info-row">
                        <span className="info-label">Emergency Contact:</span>
                        <span className="info-value">
                          {[emergencyFirstName, emergencyMiddleName, emergencyLastName].filter(Boolean).join(' ')}
                        </span>
                      </div>
                    )}
                    {emergencyRelationship && (
                      <div className="info-row">
                        <span className="info-label">Relationship:</span>
                        <span className="info-value">{emergencyRelationship}</span>
                      </div>
                    )}
                    {emergencyPhone && (
                      <div className="info-row">
                        <span className="info-label">Emergency Phone:</span>
                        <span className="info-value">{emergencyPhone}</span>
                      </div>
                    )}
                    {emergencyEmail && (
                      <div className="info-row">
                        <span className="info-label">Emergency Email:</span>
                        <span className="info-value">{emergencyEmail}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      ) : null}

      {/* Insurance Section */}
      {(insuranceDataLoaded && Object.keys(insuranceDataLoaded).length > 0) || (insuranceData && Object.keys(insuranceData).length > 0) ? (
        <section className="insurance-section">
          <div className="section-header-container">
            <h3 className="section-header">Insurance Information</h3>
          </div>
          <div className="insurance-display">
            <div className="insurance-info">
              {(() => {
                const data = insuranceDataLoaded || insuranceData;
                const primaryCompanyName = data.insurance?.primary?.company_name || data.primaryCompanyName;
                const primaryPolicyNumber = data.insurance?.primary?.policy_number || data.primaryPolicyNumber;
                const primaryGroupNumber = data.insurance?.primary?.group_number || data.primaryGroupNumber;
                const primaryPlanType = data.insurance?.primary?.plan_type || data.primaryPlanType;
                const primaryStartDate = data.insurance?.primary?.effective_start || data.primaryStartDate;
                const primaryEndDate = data.insurance?.primary?.effective_end || data.primaryEndDate;

                const secondaryCompanyName = data.insurance?.secondary?.company_name || data.secondaryCompanyName;
                const secondaryPolicyNumber = data.insurance?.secondary?.policy_number || data.secondaryPolicyNumber;
                const secondaryGroupNumber = data.insurance?.secondary?.group_number || data.secondaryGroupNumber;
                const secondaryPlanType = data.insurance?.secondary?.plan_type || data.secondaryPlanType;
                const secondaryStartDate = data.insurance?.secondary?.effective_start || data.secondaryStartDate;
                const secondaryEndDate = data.insurance?.secondary?.effective_end || data.secondaryEndDate;

                const contactNumber = data.insurance?.insurance_contact_number || data.contactNumber;

                return (
                  <>
                    <div className="insurance-block">
                      <h4>Primary Insurance</h4>
                      {primaryCompanyName && <p><strong>Company Name:</strong> {primaryCompanyName}</p>}
                      {primaryPolicyNumber && <p><strong>Policy Number:</strong> {primaryPolicyNumber}</p>}
                      {primaryGroupNumber && <p><strong>Group Number:</strong> {primaryGroupNumber}</p>}
                      {primaryPlanType && <p><strong>Plan Type:</strong> {primaryPlanType}</p>}
                      <p>
                        <strong>Effective Dates:</strong>{' '}
                        {primaryStartDate && primaryEndDate ? `${primaryStartDate} - ${primaryEndDate}` : 'N/A'}
                      </p>
                    </div>

                    {(secondaryCompanyName || secondaryPolicyNumber) && (
                      <div className="insurance-block">
                        <h4>Secondary Insurance</h4>
                        {secondaryCompanyName && <p><strong>Company Name:</strong> {secondaryCompanyName}</p>}
                        {secondaryPolicyNumber && <p><strong>Policy Number:</strong> {secondaryPolicyNumber}</p>}
                        {secondaryGroupNumber && <p><strong>Group Number:</strong> {secondaryGroupNumber}</p>}
                        {secondaryPlanType && <p><strong>Plan Type:</strong> {secondaryPlanType}</p>}
                        <p>
                          <strong>Effective Dates:</strong>{' '}
                          {secondaryStartDate && secondaryEndDate ? `${secondaryStartDate} - ${secondaryEndDate}` : 'N/A'}
                        </p>
                      </div>
                    )}

                    {contactNumber && (
                      <div className="insurance-block">
                        <h4>Contact Information</h4>
                        <p><strong>Contact Number:</strong> {contactNumber}</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </section>
      ) : null}

      {/* Allergies Section */}
      {allergiesData && (
        <section className="allergy-section">
          <div className="section-header-container">
            <h3 className="section-header">Allergies</h3>
          </div>
          <div className="allergy-display">
            {allergiesData.length > 0 ? (
              <div className="allergy-grid">
                {allergiesData.map((allergy, index) => (
                  <div key={index} className="allergy-column">
                    <h4 className="allergy-title">Allergy {index + 1}</h4>
                    <ul className="allergy-list">
                      {allergy.allergen && <li><strong>Allergen:</strong> {allergy.allergen}</li>}
                      {allergy.category && <li><strong>Category:</strong> {allergy.category}</li>}
                      {allergy.reaction && <li><strong>Reaction:</strong> {allergy.reaction}</li>}
                      {allergy.severity && <li><strong>Severity:</strong> {allergy.severity}</li>}
                      {allergy.status && <li><strong>Status:</strong> {allergy.status}</li>}
                      {allergy.code && <li><strong>Code:</strong> {allergy.code}</li>}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="info-value">No allergies recorded.</p>
            )}
          </div>
        </section>
      )}

      {/* Family History Section */}
      {familyHistoryData && (
        <section className="family-history-section">
          <div className="section-header-container">
            <h3 className="section-header">Family History</h3>
          </div>
          <div className="family-history-display">
            {/* Family Members */}
            {familyHistoryData.familyMembers && familyHistoryData.familyMembers.length > 0 ? (
              <>
                <h4>Family Members</h4>
                <div className="family-members-grid">
                  {familyHistoryData.familyMembers.map((member, index) => (
                    <div key={index} className="family-member">
                      <h5 className="family-member-title">{member.firstName} {member.lastName}</h5>
                      <div className="info-grid">
                        <div className="info-row"><span className="info-label">Relationship:</span><span className="info-value">{member.relationship}</span></div>
                        {member.dob && <div className="info-row"><span className="info-label">DOB:</span><span className="info-value">{formatDate(member.dob)}</span></div>}
                        {member.gender && <div className="info-row"><span className="info-label">Gender:</span><span className="info-value">{member.gender}</span></div>}
                        <div className="info-row"><span className="info-label">Deceased:</span><span className="info-value">{member.deceased ? 'Yes' : 'No'}</span></div>
                        {member.medicalConditions && member.medicalConditions.length > 0 && (
                          <div className="info-row"><span className="info-label">Medical Conditions:</span><span className="info-value">{member.medicalConditions.join(', ')}</span></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="info-value">No family members recorded.</p>
            )}

            {/* Genetic Conditions */}
            {familyHistoryData.geneticConditions && familyHistoryData.geneticConditions.length > 0 && (
              <div className="genetic-conditions-section">
                <h4>Genetic Conditions</h4>
                <div className="genetic-conditions-grid">
                  {familyHistoryData.geneticConditions.map((condition, index) => (
                    <div key={index} className="family-member">
                      <h5 className="family-member-title">{condition.conditionName}</h5>
                      <div className="info-grid">
                        {condition.affectedMember && <div className="info-row"><span className="info-label">Affected Member:</span><span className="info-value">{condition.affectedMember}</span></div>}
                        {condition.testResults && <div className="info-row"><span className="info-label">Test Results:</span><span className="info-value">{condition.testResults}</span></div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Social History Section */}
      {socialHistoryData && (
        <section className="social-history-section">
          <div className="section-header-container">
            <h3 className="section-header">Social History</h3>
          </div>
          <div className="social-history-display">
            <div className="social-history-grid">

              {/* Tobacco Smoking */}
              <div className="social-history-column">
                <h4>Tobacco Smoking</h4>
                {socialHistoryData.tobaccoSmoking ? (
                  <div className="info-grid">
                    {socialHistoryData.tobaccoSmoking.current_status && <div className="info-row"><span className="info-label">Status:</span><span className="info-value">{socialHistoryData.tobaccoSmoking.current_status}</span></div>}
                    {socialHistoryData.tobaccoSmoking.average_daily_consumption && <div className="info-row"><span className="info-label">Daily Consumption:</span><span className="info-value">{socialHistoryData.tobaccoSmoking.average_daily_consumption} cigarettes/day</span></div>}
                    {socialHistoryData.tobaccoSmoking.duration_of_use && <div className="info-row"><span className="info-label">Duration:</span><span className="info-value">{socialHistoryData.tobaccoSmoking.duration_of_use} {socialHistoryData.tobaccoSmoking.duration_unit}</span></div>}
                    {socialHistoryData.tobaccoSmoking.quit_date && <div className="info-row"><span className="info-label">Quit Date:</span><span className="info-value">{socialHistoryData.tobaccoSmoking.quit_date}</span></div>}
                    {socialHistoryData.tobaccoSmoking.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.tobaccoSmoking.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Tobacco Consumption */}
              <div className="social-history-column">
                <h4>Tobacco Consumption</h4>
                {socialHistoryData.tobaccoConsumption ? (
                  <div className="info-grid">
                    {socialHistoryData.tobaccoConsumption.current_status && <div className="info-row"><span className="info-label">Status:</span><span className="info-value">{socialHistoryData.tobaccoConsumption.current_status}</span></div>}
                    {socialHistoryData.tobaccoConsumption.average_daily_consumption && <div className="info-row"><span className="info-label">Daily Consumption:</span><span className="info-value">{socialHistoryData.tobaccoConsumption.average_daily_consumption}</span></div>}
                    {socialHistoryData.tobaccoConsumption.duration_of_use && <div className="info-row"><span className="info-label">Duration:</span><span className="info-value">{socialHistoryData.tobaccoConsumption.duration_of_use} {socialHistoryData.tobaccoConsumption.duration_unit}</span></div>}
                    {socialHistoryData.tobaccoConsumption.quit_date && <div className="info-row"><span className="info-label">Quit Date:</span><span className="info-value">{socialHistoryData.tobaccoConsumption.quit_date}</span></div>}
                    {socialHistoryData.tobaccoConsumption.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.tobaccoConsumption.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Alcohol Use */}
              <div className="social-history-column">
                <h4>Alcohol Use</h4>
                {socialHistoryData.alcohol ? (
                  <div className="info-grid">
                    {socialHistoryData.alcohol.current_status && <div className="info-row"><span className="info-label">Status:</span><span className="info-value">{socialHistoryData.alcohol.current_status}</span></div>}
                    {socialHistoryData.alcohol.average_weekly_consumption && <div className="info-row"><span className="info-label">Weekly Consumption:</span><span className="info-value">{socialHistoryData.alcohol.average_weekly_consumption} drinks/week</span></div>}
                    {socialHistoryData.alcohol.type_of_alcohol && <div className="info-row"><span className="info-label">Type:</span><span className="info-value">{socialHistoryData.alcohol.type_of_alcohol}</span></div>}
                    {socialHistoryData.alcohol.period_of_use && <div className="info-row"><span className="info-label">Period of Use:</span><span className="info-value">{socialHistoryData.alcohol.period_of_use}</span></div>}
                    {socialHistoryData.alcohol.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.alcohol.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Financial Resources */}
              <div className="social-history-column">
                <h4>Financial Resources</h4>
                {socialHistoryData.financial ? (
                  <div className="info-grid">
                    {socialHistoryData.financial.income_level && <div className="info-row"><span className="info-label">Income Level:</span><span className="info-value">{socialHistoryData.financial.income_level}</span></div>}
                    {socialHistoryData.financial.employment_status && <div className="info-row"><span className="info-label">Employment Status:</span><span className="info-value">{socialHistoryData.financial.employment_status}</span></div>}
                    {socialHistoryData.financial.financial_support && <div className="info-row"><span className="info-label">Financial Support:</span><span className="info-value">{socialHistoryData.financial.financial_support}</span></div>}
                    {socialHistoryData.financial.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.financial.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Education */}
              <div className="social-history-column">
                <h4>Education</h4>
                {socialHistoryData.education?.highest_level_of_education ? (
                  <div className="info-grid">
                    <div className="info-row"><span className="info-label">Highest Level:</span><span className="info-value">{socialHistoryData.education.highest_level_of_education}</span></div>
                    {socialHistoryData.education.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.education.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Physical Activity */}
              <div className="social-history-column">
                <h4>Physical Activity</h4>
                {socialHistoryData.physicalActivity ? (
                  <div className="info-grid">
                    {socialHistoryData.physicalActivity.frequency && <div className="info-row"><span className="info-label">Frequency:</span><span className="info-value">{socialHistoryData.physicalActivity.frequency}</span></div>}
                    {socialHistoryData.physicalActivity.type_of_exercise && <div className="info-row"><span className="info-label">Type:</span><span className="info-value">{socialHistoryData.physicalActivity.type_of_exercise}</span></div>}
                    {socialHistoryData.physicalActivity.duration && <div className="info-row"><span className="info-label">Duration:</span><span className="info-value">{socialHistoryData.physicalActivity.duration} {socialHistoryData.physicalActivity.duration_unit}</span></div>}
                    {socialHistoryData.physicalActivity.consistency && <div className="info-row"><span className="info-label">Consistency:</span><span className="info-value">{socialHistoryData.physicalActivity.consistency}</span></div>}
                    {socialHistoryData.physicalActivity.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.physicalActivity.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Stress */}
              <div className="social-history-column">
                <h4>Stress</h4>
                {socialHistoryData.stress ? (
                  <div className="info-grid">
                    {socialHistoryData.stress.perceived_stress_level && <div className="info-row"><span className="info-label">Stress Level:</span><span className="info-value">{socialHistoryData.stress.perceived_stress_level}</span></div>}
                    {socialHistoryData.stress.major_stressors && <div className="info-row"><span className="info-label">Major Stressors:</span><span className="info-value">{socialHistoryData.stress.major_stressors}</span></div>}
                    {socialHistoryData.stress.coping_mechanisms && <div className="info-row"><span className="info-label">Coping Mechanisms:</span><span className="info-value">{socialHistoryData.stress.coping_mechanisms}</span></div>}
                    {socialHistoryData.stress.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.stress.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Social Isolation */}
              <div className="social-history-column">
                <h4>Social Isolation & Connection</h4>
                {socialHistoryData.socialIsolation ? (
                  <div className="info-grid">
                    {socialHistoryData.socialIsolation.isolation_status && <div className="info-row"><span className="info-label">Isolation Status:</span><span className="info-value">{socialHistoryData.socialIsolation.isolation_status}</span></div>}
                    {socialHistoryData.socialIsolation.social_support && <div className="info-row"><span className="info-label">Social Support:</span><span className="info-value">{socialHistoryData.socialIsolation.social_support}</span></div>}
                    {socialHistoryData.socialIsolation.frequency_of_social_interactions && <div className="info-row"><span className="info-label">Frequency of Interactions:</span><span className="info-value">{socialHistoryData.socialIsolation.frequency_of_social_interactions}</span></div>}
                    {socialHistoryData.socialIsolation.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.socialIsolation.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Exposure to Violence */}
              <div className="social-history-column">
                <h4>Exposure to Violence</h4>
                {socialHistoryData.exposureToViolence ? (
                  <div className="info-grid">
                    {socialHistoryData.exposureToViolence.type_of_violence && <div className="info-row"><span className="info-label">Type of Violence:</span><span className="info-value">{socialHistoryData.exposureToViolence.type_of_violence}</span></div>}
                    {socialHistoryData.exposureToViolence.date_of_last_exposure && <div className="info-row"><span className="info-label">Last Exposure:</span><span className="info-value">{socialHistoryData.exposureToViolence.date_of_last_exposure}</span></div>}
                    {socialHistoryData.exposureToViolence.support_or_intervention_received && <div className="info-row"><span className="info-label">Support Received:</span><span className="info-value">{socialHistoryData.exposureToViolence.support_or_intervention_received}</span></div>}
                    {socialHistoryData.exposureToViolence.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.exposureToViolence.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Gender Identity */}
              <div className="social-history-column">
                <h4>Gender Identity</h4>
                {socialHistoryData.genderIdentity?.gender_identity ? (
                  <div className="info-grid">
                    <div className="info-row"><span className="info-label">Identity:</span><span className="info-value">{socialHistoryData.genderIdentity.gender_identity}</span></div>
                    {socialHistoryData.genderIdentity.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.genderIdentity.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Sexual Orientation */}
              <div className="social-history-column">
                <h4>Sexual Orientation</h4>
                {socialHistoryData.sexualOrientation?.sexual_orientation ? (
                  <div className="info-grid">
                    <div className="info-row"><span className="info-label">Orientation:</span><span className="info-value">{socialHistoryData.sexualOrientation.sexual_orientation}</span></div>
                    {socialHistoryData.sexualOrientation.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.sexualOrientation.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Nutrients History */}
              <div className="social-history-column">
                <h4>Nutrients History</h4>
                {socialHistoryData.nutrients ? (
                  <div className="info-grid">
                    {socialHistoryData.nutrients.dietary_preferences && <div className="info-row"><span className="info-label">Dietary Preferences:</span><span className="info-value">{socialHistoryData.nutrients.dietary_preferences}</span></div>}
                    {socialHistoryData.nutrients.supplement_usage && <div className="info-row"><span className="info-label">Supplement Usage:</span><span className="info-value">{socialHistoryData.nutrients.supplement_usage}</span></div>}
                    {socialHistoryData.nutrients.notes && <div className="info-row"><span className="info-label">Notes:</span><span className="info-value">{socialHistoryData.nutrients.notes}</span></div>}
                  </div>
                ) : (
                  <p className="info-value">No information recorded.</p>
                )}
              </div>

              {/* Social Text */}
              {socialHistoryData.socialText?.notes && (
                <div className="social-history-column">
                  <h4>Additional Notes</h4>
                  <p>{socialHistoryData.socialText.notes}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* No Data Message */}
      {!(
        (patientDataLoaded && Object.keys(patientDataLoaded).length > 0) ||
        (patientData && Object.keys(patientData).length > 0) ||
        (contactDataLoaded && Object.keys(contactDataLoaded).length > 0) ||
        (contactData && Object.keys(contactData).length > 0) ||
        (insuranceDataLoaded && Object.keys(insuranceDataLoaded).length > 0) ||
        (insuranceData && Object.keys(insuranceData).length > 0) ||
        (allergiesData?.length > 0) ||
        (familyHistoryData?.familyMembers?.length > 0 || familyHistoryData?.geneticConditions?.length > 0) ||
        (socialHistoryData && Object.keys(socialHistoryData).some(key => socialHistoryData[key]))
      ) && (
          <p className="info-value">No data yet. Fill in the forms to preview.</p>
        )}

      {/* Next Button */}
      <div className="preview-footer">
        <button onClick={handleNext} className="preview-next-button">
          Next →
        </button>
      </div>
    </div>
  );
}