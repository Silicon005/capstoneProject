const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getTeacherDashboard = async (req, res) => {
  try {
    const { teacherId } = req.params;

    if (!teacherId) {
      return res.status(400).json({ success: false, message: "Teacher ID is required" });
    }

    const now = new Date();

    // ✅ Fetch only required test data
    const tests = await prisma.test.findMany({
      where: { teacherId },
      include: {
        testSubmissions: true,
        course: {
          include: {
            enrollments: true
          }
        }
      }
    });

    const testCounts = {
      done: 0,
      ongoing: 0,
      upcoming: 0
    };

    tests.forEach(test => {
      const start = new Date(test.startTime);
      const end = new Date(test.endTime);
      if (end < now) testCounts.done++;
      else if (start <= now && end >= now) testCounts.ongoing++;
      else if (start > now) testCounts.upcoming++;
    });

    const coursesMap = new Map(); // Avoid duplicate courses
    let totalStudents = 0;
    const allSubmissions = [];

    tests.forEach(test => {
      allSubmissions.push(...test.testSubmissions);
      const course = test.course;
      if (!coursesMap.has(course.id)) {
        coursesMap.set(course.id, course);
        totalStudents += course.enrollments.length;
      }
    });

    const avgScore =
      allSubmissions.length > 0
        ? Math.round(
            allSubmissions.reduce((sum, s) => sum + s.marksObtained, 0) /
              allSubmissions.length
          )
        : 0;

    const performanceData = [...coursesMap.values()].map(course => {
      const courseTests = tests.filter(test => test.courseId === course.id);
      const courseSubs = courseTests.flatMap(t => t.testSubmissions);
      const totalMarks = courseSubs.reduce((sum, sub) => sum + sub.marksObtained, 0);
      const avg = courseSubs.length > 0 ? Math.round(totalMarks / courseSubs.length) : 0;
      return { name: course.name, score: avg };
    });

    return res.status(200).json({
      success: true,
      dashboard: {
        courseStats: {
          total: coursesMap.size,
          activeStudents: totalStudents,
          avgScore,
          completionRate: Math.round(
            (testCounts.done / (testCounts.done + testCounts.ongoing + testCounts.upcoming || 1)) * 100
          )
        },
        testCounts,
        performanceData
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getTestDetails = async (req, res) => {  
    try {
        const { teacherId } = req.params;
        const tests = await prisma.test.findMany({
          where: { teacherId },
          select: { id: true, name: true }
        });
        return res.json({ tests });
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching tests" });
      }
};

const getTestanalytics = async (req, res) => {
    try {
      const { selectedTestId } = req.params;
      console.log("testId", selectedTestId);
  
      const test = await prisma.test.findUnique({
        where: { id: selectedTestId },
        include: {
          testSubmissions: true,
          course: {
            include: {
              enrollments: true,
            },
          },
        },
      });
  
      if (!test) return res.status(404).json({ success: false, message: "Test not found" });
  
      const totalStudents = test.course.enrollments.length;
      const attempts = test.testSubmissions.length;
  
      const totalMarks = test.testSubmissions.reduce((sum, s) => sum + s.marksObtained, 0);
      const maxMarks = test.totalMarks || 100; // fallback if not set
      const avgMarks = attempts > 0 ? totalMarks / attempts : 0;
  
      const correctPercent = attempts > 0 ? Math.round((totalMarks / (attempts * maxMarks)) * 100) : 0;
  
      return res.status(200).json({
        success: true,
        analytics: {
          selectedTestId,
          testName: test.name,
          totalStudents,
          attempts,
          avgMarks: Math.round(avgMarks),
          correctPercent,
        },
      });
    } catch (error) {
      console.error("Test analytics error:", error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
  

module.exports = {
    getTeacherDashboard,
    getTestDetails,
    getTestanalytics
};

  