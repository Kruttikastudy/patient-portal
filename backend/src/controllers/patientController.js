const mongoose = require("mongoose");
const Patient = require("../models/patients");

const toObjectId = (value) => {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) {
    return null;
  }
  return new mongoose.Types.ObjectId(value);
};

const fetchPatient = async (patientId) => {
  const id = toObjectId(patientId);
  if (!id) {
    return null;
  }
  return Patient.findById(id).lean();
};

const formatDemographics = (patient) => ({
  patientId: patient._id?.toString(),
  name: patient.name || {},
  date_of_birth: patient.date_of_birth,
  gender: patient.gender,
  blood_group: patient.blood_group,
  occupation: patient.occupation,
  aadhaar: patient.aadhaar,
  pan: patient.pan,
  address: patient.address || {}
});

const formatContact = (patient) => ({
  id: patient._id?.toString(),
  contact_info: patient.contact_info || {}
});

const formatInsurance = (patient) => ({
  patient_id: patient._id?.toString(),
  insurance: patient.insurance || {}
});

const formatAllergies = (patient) => patient.allergies || [];

const formatFamilyHistory = (patient) => {
  const family = patient.family_history || {};
  const familyMembers = (family.family_members || []).map((member) => ({
    firstName: member?.name?.first,
    middleName: member?.name?.middle,
    lastName: member?.name?.last,
    dob: member?.date_of_birth,
    gender: member?.gender,
    relationship: member?.relationship,
    deceased: member?.deceased,
    medicalConditions: member?.medical_conditions || [],
    geneticConditions: member?.genetic_conditions || []
  }));

  const geneticConditions =
    familyMembers
      .map((member) =>
        (member.geneticConditions || []).map((condition) => ({
          conditionName: condition?.condition_name,
          affectedMember: condition?.affected_family_member,
          testResults: condition?.genetic_testing_results,
          familyMemberName: [member.firstName, member.lastName].filter(Boolean).join(" ")
        }))
      )
      .flat() || [];

  return {
    familyMembers,
    geneticConditions
  };
};

const formatSocialHistory = (patient) => {
  const social = patient.social_history || {};
  return {
    tobaccoSmoking: social.tobacco_smoking || null,
    tobaccoConsumption: social.tobacco_consumption || null,
    alcohol: social.alcohol_use || null,
    socialText: social.social_history_free_text || null,
    financial: social.financial_resources || null,
    education: social.education || null,
    physicalActivity: social.physical_activity || null,
    stress: social.stress || null,
    socialIsolation: social.social_isolation_connection || null,
    exposureToViolence: social.exposure_to_violence || null,
    genderIdentity: social.gender_identity || null,
    sexualOrientation: social.sexual_orientation || null,
    nutrients: social.nutrients_history || null
  };
};

const SOCIAL_SECTION_MAP = {
  "tobacco-smoking": "tobacco_smoking",
  "tobacco-consumption": "tobacco_consumption",
  alcohol: "alcohol_use",
  "social-text": "social_history_free_text",
  "financial-resources": "financial_resources",
  education: "education",
  "physical-activity": "physical_activity",
  stress: "stress",
  "social-isolation": "social_isolation_connection",
  "exposure-to-violence": "exposure_to_violence",
  "gender-identity": "gender_identity",
  "sexual-orientation": "sexual_orientation",
  "nutrients-history": "nutrients_history"
};

const ensurePatient = async (patientId, res) => {
  const patient = await fetchPatient(patientId);
  if (!patient) {
    res.status(404).json({
      success: false,
      message: "Patient not found"
    });
  }
  return patient;
};

const getPatientDemographics = async (req, res) => {
  try {
    const patient = await ensurePatient(req.params.patientId, res);
    if (!patient) return;
    res.json({
      success: true,
      data: formatDemographics(patient)
    });
  } catch (error) {
    console.error("Demographics fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch patient demographics"
    });
  }
};

const getPatientContactInfo = async (req, res) => {
  try {
    const patient = await ensurePatient(req.params.patientId, res);
    if (!patient) return;
    res.json({
      success: true,
      data: formatContact(patient)
    });
  } catch (error) {
    console.error("Contact info fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch contact information"
    });
  }
};

const getPatientInsurance = async (req, res) => {
  try {
    const patient = await ensurePatient(req.params.patientId, res);
    if (!patient) return;
    res.json({
      success: true,
      insurance: formatInsurance(patient).insurance,
      patient_id: patient._id?.toString()
    });
  } catch (error) {
    console.error("Insurance fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch insurance information"
    });
  }
};

const getPatientAllergies = async (req, res) => {
  try {
    const patient = await ensurePatient(req.params.patientId, res);
    if (!patient) return;
    res.json({
      success: true,
      data: formatAllergies(patient)
    });
  } catch (error) {
    console.error("Allergies fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch allergies"
    });
  }
};

const getPatientFamilyHistory = async (req, res) => {
  try {
    const patient = await ensurePatient(req.params.patientId, res);
    if (!patient) return;
    res.json({
      success: true,
      data: formatFamilyHistory(patient)
    });
  } catch (error) {
    console.error("Family history fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch family history"
    });
  }
};

const getSocialHistoryOverview = async (req, res) => {
  try {
    const patient = await ensurePatient(req.params.patientId, res);
    if (!patient) return;
    res.json({
      success: true,
      data: formatSocialHistory(patient)
    });
  } catch (error) {
    console.error("Social history fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch social history"
    });
  }
};

const getSocialHistorySection = async (req, res) => {
  try {
    const { patientId, section } = req.params;
    const patient = await ensurePatient(patientId, res);
    if (!patient) return;

    const social = patient.social_history || {};

    if (section === "summary") {
      return res.json({
        success: true,
        data: formatSocialHistory(patient)
      });
    }

    const fieldName = SOCIAL_SECTION_MAP[section];
    if (!fieldName) {
      return res.status(400).json({
        success: false,
        message: "Unknown social history section"
      });
    }

    res.json({
      success: true,
      data: social[fieldName] || null
    });
  } catch (error) {
    console.error("Social history section fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch social history section"
    });
  }
};

const getPatientProfileSummary = async (req, res) => {
  try {
    const patient = await ensurePatient(req.params.patientId, res);
    if (!patient) return;

    const demographics = formatDemographics(patient);
    const contact = formatContact(patient);
    const insurance = formatInsurance(patient);
    const allergies = formatAllergies(patient);
    const familyHistory = formatFamilyHistory(patient);
    const socialHistory = formatSocialHistory(patient);

    res.json({
      success: true,
      data: {
        demographics,
        contact,
        insurance,
        allergies,
        familyHistory,
        socialHistory
      }
    });
  } catch (error) {
    console.error("Profile summary fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch patient profile"
    });
  }
};

const getPatientVisits = async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const Visit = require("../models/visits");

    const visits = await Visit.find({ patient_id: patientId })
      .sort({ createdAt: -1 }) // Sort by most recent
      .lean();

    res.json({
      success: true,
      data: visits
    });
  } catch (error) {
    console.error("Visits fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch patient visits"
    });
  }
};

module.exports = {
  getPatientDemographics,
  getPatientContactInfo,
  getPatientInsurance,
  getPatientAllergies,
  getPatientFamilyHistory,
  getSocialHistoryOverview,
  getSocialHistorySection,
  getPatientProfileSummary,
  getPatientVisits
};


