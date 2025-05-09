const express = require("express");
const { addManualQuestion } = require("../controllers/manualtestController");

const router = express.Router();

// Route to add a manual question
router.post("/add", addManualQuestion);

module.exports = router;
