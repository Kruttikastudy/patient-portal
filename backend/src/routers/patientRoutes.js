const express = require("express");
const {
  getPatientDemographics,
  getPatientContactInfo,
  getPatientInsurance,
  getPatientAllergies,
  getPatientFamilyHistory,
  getSocialHistoryOverview,
  getSocialHistorySection,
  getPatientProfileSummary
} = require("../controllers/patientController");

const router = express.Router();

router.get("/patient-demographics/:patientId", getPatientDemographics);
router.get("/contact-information/:patientId", getPatientContactInfo);
router.get("/insurance/:patientId", getPatientInsurance);
router.get("/allergies/:patientId", getPatientAllergies);
router.get("/family-history/:patientId", getPatientFamilyHistory);
router.get("/social-history/:patientId", getSocialHistoryOverview);
router.get("/social-history/:patientId/:section", getSocialHistorySection);
router.get("/patients/:patientId/profile", getPatientProfileSummary);
router.get("/visits/:patientId", require("../controllers/patientController").getPatientVisits);

module.exports = router;


