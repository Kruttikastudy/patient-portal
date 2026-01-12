const mongoose = require("mongoose");
const Patient = require("../models/patients");

const normalize = (value = "") => value.trim().toLowerCase();

const login = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username (patient first name) and password (patient ID) are required"
    });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(password)) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const patient = await Patient.findById(password).lean();

    if (!patient) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const firstName = patient?.name?.first || "";

    if (normalize(firstName) !== normalize(username)) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const fullName = [
      patient?.name?.first,
      patient?.name?.middle,
      patient?.name?.last
    ]
      .filter(Boolean)
      .join(" ");

    return res.json({
      success: true,
      data: {
        patientId: patient._id.toString(),
        fullName,
        firstName: patient?.name?.first || "",
        lastName: patient?.name?.last || ""
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to authenticate. Please try again later."
    });
  }
};

module.exports = { login };


