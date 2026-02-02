const express = require("express");
const { getConditionAdvice } = require("../controllers/aiController");

const router = express.Router();

router.post("/condition-advice", getConditionAdvice);

module.exports = router;
