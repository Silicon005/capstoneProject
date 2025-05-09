const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/teacherDashboard.controller');

// GET /api/teacher/dashboard/:teacherId
router.get('/dashboard/teacher/:teacherId', dashboardController.getTeacherDashboard);
router.get('/dashboard/teacher/tests/:teacherId', dashboardController.getTestDetails);
router.get('/dashboard/teacher/testanalytics/:selectedTestId', dashboardController.getTestanalytics);
module.exports = router;
