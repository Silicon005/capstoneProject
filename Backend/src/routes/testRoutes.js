const express = require("express");
const { createTest, getTests, getTestDetails} = require("../controllers/testController");

const router = express.Router();

router.post("/create-test", createTest);
router.get("/get-tests", getTests);
router.get("/preview/:testId",getTestDetails)

module.exports = router;
