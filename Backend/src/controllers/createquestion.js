const { PrismaClient } = require("@prisma/client");
const redis = require("../utils/redis"); 
const prisma = new PrismaClient();


const getCourseByTopicId = async (req, res) => {
    try {
        const { topicId } = req.params;

        if (!topicId) {
            return res.status(400).json({ error: "Topic ID is required" });
        }
    
        const topic = await prisma.topic.findUnique({
            where: { id: topicId },
            include: {
                chapter: {
                    include: {
                        course: {
                            select: {
                                id: true,
                                teacherId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!topic || !topic.chapter || !topic.chapter.course) {
            return res.status(404).json({ error: "No course found for this topic" });
        }

        return res.status(200).json(topic.chapter.course);
    } catch (error) {
        console.error("Error fetching course:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const createQuestions = async (req, res) => {
    try {
      const {
        name,
        totalMarks,
        topicId,
        questions,
        teacherId,
        courseId,
        startTime,
        endTime,
        duration
      } = req.body;
  
      if (!name || !totalMarks || !topicId || !Array.isArray(questions) || !courseId || !teacherId || !startTime || !endTime || !duration) {
        return res.status(400).json({ error: "Invalid input data" });
      }
  
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { name: true }
      });
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      const createdTest = await prisma.test.create({
        data: {
          name,
          totalMarks,
          topicId,
          teacherId,
          courseId,
          startTime,
          endTime,
          duration,
          testQuestions: {
            create: questions.map(q => ({
              question: {
                create: {
                  text: q.questionText,
                  level: q.level || 1,
                  type: q.type === "mcq" ? "MCQ" : "DIRECT_ANSWER",
                  options: q.type === "mcq" ? q.options : [],
                  correctAnswer: q.answer,
                  courseId,
                  teacherId,
                  hints: q.hints || [],
                }
              }
            }))
          }
        },
        include: {
          testQuestions: {
            include: {
              question: true,
            },
          },
        },
      });
  
      const enrolledStudents = await prisma.enrollment.findMany({
        where: {
          courseId,
          status: "ENROLLED"
        },
        select: {
          studentId: true
        }
      });
  
      const enrolledStudentIds = enrolledStudents.map((s) => s.studentId);
  
      const message = `New test '${name}' created for '${course.name}'. Starts at ${startTime}`;
  
      const studentNotifications = enrolledStudentIds.map((studentId) => ({
        userId: studentId,
        message,
        type: "CREATED_TEST"
      }));
  
      await prisma.notification.createMany({
        data: studentNotifications
      });
  
      const teacherNotification = await prisma.notification.create({
        data: {
          userId: teacherId,
          message,
          type: "CREATED_TEST"
        }
      });
  
      for (const studentId of enrolledStudentIds) {
        await redis.publish(
          `notifications:${studentId}`,
          JSON.stringify({ message, type: "CREATED_TEST" })
        );
      }
  
      await redis.publish(
        `notifications:${teacherId}`,
        JSON.stringify(teacherNotification)
      );
  
      return res.status(201).json({
        success: true,
        message: "Test and notifications created",
        createdTest
      });
    } catch (error) {
      console.error("Error creating test and questions:", error);
      return res.status(500).json({ error: "Server error" });
    }
  };
  


module.exports = { createQuestions , getCourseByTopicId};
