const express = require("express");
const router = express.Router();
const { getQuestions } = require("../controllers/questionbank");

router.get("/questions", getQuestions);

module.exports = router;
