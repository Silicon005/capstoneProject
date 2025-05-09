const express = require("express");
const { getSemesters } = require("../controllers/getsemesterController");

const router = express.Router();

router.get("/semesters", getSemesters);

module.exports = router;
