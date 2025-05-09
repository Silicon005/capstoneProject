const express = require("express");
const { createQuestions, getCourseByTopicId } = require("../controllers/createquestion");

const router = express.Router();

// Route to create questions
router.post("/createQuestions", createQuestions);
router.get("/getCourse/:topicId", getCourseByTopicId);

module.exports = router;
