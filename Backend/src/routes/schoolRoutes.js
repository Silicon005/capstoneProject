const express = require("express");
const { createSchoolHandler, getAllSchoolsHandler } = require("../controllers/schoolController");
const { isAuthenticated } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/schools", createSchoolHandler , isAuthenticated);
router.get("/schools", getAllSchoolsHandler , isAuthenticated);

module.exports = router;
