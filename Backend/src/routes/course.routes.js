const express = require('express');
const { 
    getTeacherCourses, 
    getCourseDetails, 
    getChapterDetails, 
    createCourse, 
    createChapter, 
    createTopic, 
    deleteTopic, 
    deleteChapter, 
    updateTopic, 
    updateChapter,
    getCourseSettings,
    updateCourse,
    updateEnrollmentKey,
    updateCourseSemester,
    updateCourseSchool,
    getEnrollments,
    enrollStudentManual,
} = require('../controllers/course.controller');

const { createQuestions } = require('../controllers/createquestion');

const router = express.Router();

// Get routes
router.get('/courses', getTeacherCourses);
router.get('/course/:courseId', getCourseDetails);
router.get('/chapter/:chapterId', getChapterDetails);

// Post routes
router.post('/createquestion', createQuestions);
router.post('/createcourse', createCourse);
router.post('/createchapter', createChapter);
router.post('/createtopic', createTopic);

// Delete routes
router.delete('/topic/:topicId', deleteTopic);
router.delete('/chapter/:chapterId', deleteChapter);

// Update routes
router.put('/topic/:topicId', updateTopic);
router.put('/chapter/:chapterId', updateChapter);

router.get("/course/:id/settings", getCourseSettings);

router.put('/:courseId/updateCourse', updateCourse);
router.put('/:courseId/enrollment-key', updateEnrollmentKey);
router.put('/:courseId/semester', updateCourseSemester);
router.put('/:courseId/school', updateCourseSchool);

router.get('/enrollments/:courseId', getEnrollments);
router.post('/enrollments/:courseId/manual', enrollStudentManual);
module.exports = router;
