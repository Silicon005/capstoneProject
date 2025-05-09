const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createTest = async (req, res) => {
  try {
    const { name, topicId, totalMarks, questions } = req.body;

    if (!topicId) {
      return res.status(400).json({ error: "Topic ID is required" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "At least one question is required" });
    }

    // Fetch Course & Teacher from Topic → Chapter → Course
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        chapter: {
          include: {
            course: true, 
          },
        },
      },
    });

    if (!topic || !topic.chapter || !topic.chapter.course) {
      return res.status(404).json({ error: "Invalid Topic ID" });
    }

    const courseId = topic.chapter.course.id;
    const teacherId = topic.chapter.course.teacherId;

    // Step 1: Create the Test
    const test = await prisma.test.create({
      data: {
        name,
        totalMarks,
        topicId,
        courseId,
        teacherId,
      },
    });

    // Step 2: Insert Questions & Link to Test
    const questionData = questions.map((q) => ({
      text: q.text,
      level: q.level,
      type: q.type || null, // Can be MCQ or DIRECT_ANSWER
      options: q.options || [], // MCQ options
      correctAnswer: q.correctAnswer || null, // Answer for direct questions
      courseId,
      teacherId,
    }));

    // Save Questions in Question Table
    const savedQuestions = await prisma.$transaction(
      questionData.map((q) => prisma.question.create({ data: q }))
    );

    // Step 3: Create TestQuestion Records
    const testQuestionData = savedQuestions.map((q) => ({
      testId: test.id,
      questionId: q.id,
    }));

    await prisma.$transaction(
      testQuestionData.map((tq) => prisma.testQuestion.create({ data: tq }))
    );

    res.status(201).json({
      message: "Test created successfully",
      test,
      questions: savedQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create test" });
  }
};

// const getTests = async (req, res) => {
//   try {
//     const { courseId } = req.query;

//     const tests = await prisma.test.findMany({
//       where: {
//         courseId: courseId ? parseInt(courseId) : undefined,  // Ensure courseId is correctly parsed
//       },
//       include: {
//         topic: {
//           include: {
//             chapter: {
//               include: {
//                 course: true,
//               },
//             },
//           },
//         },
//         testQuestions: {
//           include: {
//             question: true,
//           },
//         },
//       },
//     });

//     res.status(200).json({ success: true, tests });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to fetch tests" });
//   }
// };
// const getTests = async (req, res) => {
//   const { topicId } = req.query; // Assuming you're sending the topic ID as a query parameter

//   console.log("Received topicId:", topicId);

//   if (!topicId) {
//     return res.status(400).json({ error: "Topic ID is required" });
//   }

//   try {
//     // Fetch tests associated with the given topic ID
//     const tests = await prisma.test.findMany({
//       where: {
//         topicId: topicId,
//       },
//       select: {
//         id: true, // Only return the test IDs
//       },
//     });

//     // Check if the tests were found
//     if (tests.length > 0) {
//       const testIds = tests.map(test => test.id);
//       console.log("Fetched Test IDs:", testIds);
//       return res.status(200).json({ success: true, testIds });
//     } else {
//       console.log("No tests found for topic ID:", topicId);
//       return res.status(404).json({ success: false, message: "No tests found for the given topicId" });
//     }
//   } catch (error) {
//     console.error("Error fetching test IDs:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getTests = async (req, res) => {
  const { topicId } = req.query;

  console.log("Received topicId:", topicId);

  if (!topicId) {
    return res.status(400).json({ error: "Topic ID is required" });
  }

  try {
    const tests = await prisma.test.findMany({
      where: { topicId },
      select: {
        id: true,
        name: true,
        totalMarks: true,
        createdAt: true,
        topic: {
          select: {
            name: true,
          },
        },
        testQuestions: {
          select: {
            question: {
              select: {
                level: true,
              },
            },
          },
        },
      },
    });

    if (tests.length > 0) {
      // Calculate average difficulty level for each test
      const formattedTests = tests.map((test) => {
        const levels = test.testQuestions.map((q) => q.question.level);
        const avgLevel = levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;

        return {
          id: test.id,
          name: test.name,
          totalMarks: test.totalMarks,
          createdAt: test.createdAt,
          topicName: test.topic.name,
          averageLevel: avgLevel.toFixed(2), // Rounded to 2 decimal places
        };
      });

      // console.log("Fetched Tests:", formattedTests);
      return res.status(200).json({ success: true, tests: formattedTests });
    } else {
      console.log("No tests found for topic ID:", topicId);
      return res.status(404).json({ success: false, message: "No tests found for the given topicId" });
    }
  } catch (error) {
    console.error("Error fetching tests:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTestDetails = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!testId) {
      return res.status(400).json({ error: "Test ID is required" });
    }

    // Fetch test with all related data
    const test = await prisma.test.findUnique({
      where: { id: testId },
      include: {
        course: {
          include: {
            enrollments: {
              include: {
                student: true
              }
            }
          }
        },
        topic: true,
        testQuestions: {
          include: {
            question: true
          }
        },
        testSubmissions: {
          include: {
            student: true
          }
        }
      }
    });

    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }

    // Get all enrolled students
    const enrolledStudents = test.course.enrollments
      .filter(e => e.status === 'ENROLLED')
      .map(e => e.student);

    // Get student marks
    const studentMarks = await prisma.testSubmission.groupBy({
      by: ['studentId'],
      where: { testId },
      _sum: {
        marksObtained: true
      }
    });

    // Create student statistics
    const studentsAttempted = studentMarks.map(sub => ({
      studentId: sub.studentId,
      totalMarks: sub._sum.marksObtained,
      studentDetails: enrolledStudents.find(s => s.id === sub.studentId)
    })).filter(s => s.studentDetails); // Filter out any undefined

    const studentsNotAttempted = enrolledStudents.filter(student => 
      !studentMarks.some(sub => sub.studentId === student.id)
    );

    // Format questions
    const formattedQuestions = test.testQuestions.map(tq => ({
      id: tq.question.id,
      text: tq.question.text,
      type: tq.question.type,
      options: tq.question.options,
      correctAnswer: tq.question.correctAnswer,
      hints: tq.question.hints,
      level: tq.question.level,
    }));

    // Format response
    const formattedTest = {
      id: test.id,
      name: test.name,
      totalMarks: test.totalMarks,
      createdAt: test.createdAt,
      course: test.course.name,
      topic: test.topic.name,
      questions: formattedQuestions,
      studentsAttempted,
      studentsNotAttempted: studentsNotAttempted.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email
      }))
    };

    res.status(200).json({
      success: true,
      test: formattedTest
    });

  } catch (error) {
    console.error("Error fetching test details:", error);
    res.status(500).json({ 
      success: false,
      error: "Internal Server Error",
      message: error.message 
    });
  }
};



module.exports = { createTest, getTests ,getTestDetails};