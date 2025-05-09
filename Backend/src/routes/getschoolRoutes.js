const express = require("express");
const { getSchools } = require("../controllers/getschool");

const router = express.Router();

// 📌 Route to get all schools
router.get("/", getSchools);

module.exports = router;
