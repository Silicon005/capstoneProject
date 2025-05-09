const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const { encrypt, decrypt } = require("../utils/crypto");

const getTeacherCourses = async (req, res) => {
    try {
        const { teacherId } = req.query;
        if (!teacherId) {
            return res.status(400).json({ success: false, message: "Teacher ID is required" });
        }

        const courses = await prisma.course.findMany({
            where: { teacherId },
            include: {
                semester: true,
                school: true
            }
        });
        // console.log("courses", courses);
        return res.json({ success: true, courses });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required" });
        }

        const courseDetails = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                chapters: {
                    include: {
                        topics: true 
                    },
                },
                semester: true,
                school: true
            }
        });
       
        if (!courseDetails) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        console.log("courseDetails", courseDetails);
        return res.json({ success: true, course: courseDetails });

    } catch (error) {
        console.error("Error fetching course details:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const getChapterDetails = async (req, res) => {
  const { chapterId } = req.params; 

  if (!chapterId) {
    return res.status(400).json({ success: false, message: "Missing chapterId" });
  }

  try {
    const topics = await prisma.topic.findMany({
      where: {
        chapterId: chapterId,
      },
    });

    res.json({ success: true, topics });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};




const createCourse = async (req, res) => {
    try {
        const { name, description, teacherId, schoolId, semesterId, enrollmentKey } = req.body;

        console.log("createCourse", req.body);

        if (!name || !teacherId || !schoolId || !semesterId || !enrollmentKey) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const encryptedKey = encrypt(enrollmentKey);

        const course = await prisma.course.create({
            data: {
                name,
                description,
                teacherId,
                schoolId,
                semesterId,
                enrollmentKey: encryptedKey
            }
        });

        return res.status(201).json({ success: true, course });
    } catch (error) {
        console.error("Error creating course:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};



const createChapter = async (req, res) => {
    try {
        const { name, courseId } = req.body;

        if (!name || !courseId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const chapter = await prisma.chapter.create({
            data: {
                name,
                courseId
            }
        });

        return res.status(201).json({ success: true, chapter });
    } catch (error) {
        console.error("Error creating chapter:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const createTopic = async (req, res) => {
    try {
        const { name, chapterId } = req.body;

        if (!name || !chapterId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const topic = await prisma.topic.create({
            data: {
                name,
                chapterId
            }
        });

        return res.status(201).json({ success: true, topic });
    } catch (error) {
        console.error("Error creating topic:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

async function deleteTopic(req, res) {
    try {
        const { topicId } = req.params;

        // Find tests under the topic
        const tests = await prisma.test.findMany({
            where: { topicId }
        });

        for (const test of tests) {
            // Delete test questions linked to the test
            await prisma.testQuestion.deleteMany({
                where: { testId: test.id }
            });

            // Delete test submissions linked to the test
            await prisma.testSubmission.deleteMany({
                where: { testId: test.id }
            });

            // Delete test statuses linked to the test
            await prisma.testStatus.deleteMany({
                where: { testId: test.id }
            });

            // Finally, delete the test
            await prisma.test.delete({
                where: { id: test.id }
            });
        }

        // Delete the topic
        await prisma.topic.delete({
            where: { id: topicId }
        });

        res.status(200).json({ message: "Topic deleted successfully" });

    } catch (error) {
        console.error("Error deleting topic:", error);
        res.status(500).json({ error: "Failed to delete topic" });
    }
}


  


async function deleteChapter(req, res) {
    try {
        const { chapterId } = req.params;

        // Find topics under the chapter
        const topics = await prisma.topic.findMany({
            where: { chapterId },
            include: { Test: true } // Fetch associated tests
        });

        for (const topic of topics) {
            if (topic.Test.length > 0) {
                for (const test of topic.Test) {
                    // Delete test questions linked to the test
                    await prisma.testQuestion.deleteMany({
                        where: { testId: test.id }
                    });

                    // Delete test submissions linked to the test
                    await prisma.testSubmission.deleteMany({
                        where: { testId: test.id }
                    });

                    // Delete test statuses linked to the test
                    await prisma.testStatus.deleteMany({
                        where: { testId: test.id }
                    });

                    // Finally, delete the test
                    await prisma.test.delete({
                        where: { id: test.id }
                    });
                }
            }

            // Delete the topic
            await prisma.topic.delete({
                where: { id: topic.id }
            });
        }

        // Finally, delete the chapter
        await prisma.chapter.delete({
            where: { id: chapterId }
        });

        res.status(200).json({ message: "Chapter deleted successfully" });

    } catch (error) {
        console.error("Error deleting chapter:", error);
        res.status(500).json({ error: "Failed to delete chapter" });
    }
}




const updateTopic = async (req, res) => {
    try {
        const { topicId } = req.params;
        const { name } = req.body;

        if (!topicId || !name) {
            return res.status(400).json({ success: false, message: "Topic ID and new name are required" });
        }

        const updatedTopic = await prisma.topic.update({
            where: { id: topicId },
            data: { name }
        });

        return res.json({ success: true, topic: updatedTopic });
    } catch (error) {
        console.error("Error updating topic:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const { name } = req.body;

        if (!chapterId || !name) {
            return res.status(400).json({ success: false, message: "Chapter ID and new name are required" });
        }

        const updatedChapter = await prisma.chapter.update({
            where: { id: chapterId },
            data: { name }
        });

        return res.json({ success: true, chapter: updatedChapter });
    } catch (error) {
        console.error("Error updating chapter:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};


const getCourseSettings = async (req, res) => {
    const { id } = req.params;
  
    try {
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          teacher: {
            select: { name: true },
          },
          semester: {
            select: { name: true },
          },
          school: {
            select: { name: true },
          },
        },
      });
  
      if (!course) return res.status(404).json({ error: "Course not found" });
  
      const decryptedKey = decrypt(course.enrollmentKey);
  
      return res.status(200).json({
        name: course.name,
        description: course.description,
        duration: course.duration,
        enrollmentKey: decryptedKey,
        teacherName: course.teacher.name,
        semester: course.semester.name,
        school: course.school.name,
      });
    } catch (error) {
      console.error("Error fetching course settings:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // Update Course (Name, Description)
const updateCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { name, description } = req.body;
  
      const data = {};
      if (name !== undefined) data.name = name;
      if (description !== undefined) data.description = description;
  
      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data,
      });
  
      res.json({ success: true, course: updatedCourse });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  // Update Enrollment Key
  const updateEnrollmentKey = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { enrollmentKey } = req.body;
  
      const encryptedKey = encrypt(enrollmentKey);
  
      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: { enrollmentKey: encryptedKey },
      });
  
      res.json({ success: true, course: updatedCourse });
    } catch (error) {
      console.error("Error updating enrollment key:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  // Update Semester
  // Update Semester
const updateCourseSemester = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { semesterId } = req.body;
  
      // Validate semester exists
      const semesterExists = await prisma.semester.findUnique({
        where: { id: semesterId }
      });
      
      if (!semesterExists) {
        return res.status(400).json({ 
          success: false, 
          message: "Semester not found" 
        });
      }
  
      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: { semesterId },
        include: { semester: true }
      });
  
      res.json({ 
        success: true, 
        semester: updatedCourse.semester.name 
      });
    } catch (error) {
      console.error("Error updating semester:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
  
  // Update School
  const updateCourseSchool = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { schoolId } = req.body;
  
      // Validate school exists
      const schoolExists = await prisma.school.findUnique({
        where: { id: schoolId }
      });
      
      if (!schoolExists) {
        return res.status(400).json({ 
          success: false, 
          message: "School not found" 
        });
      }
  
      const updatedCourse = await prisma.course.update({
        where: { id: courseId },
        data: { schoolId },
        include: { school: true }
      });
  
      res.json({ 
        success: true, 
        school: updatedCourse.school.name 
      });
    } catch (error) {
      console.error("Error updating school:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  // Add to your course controller
const getEnrollments = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId },
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
  
      const formatted = enrollments.map(e => ({
        id: e.id,
        name: e.student.name,
        email: e.student.email,
        status: e.status,
        enrolledAt: e.enrolledAt
      }));
  
      res.json(formatted);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  const enrollStudentManual = async (req, res) => {
    try {
      const { courseId } = req.params;
      const { email } = req.body;
  
      // Find student by email
      const student = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
      });
  
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
  
      // Check if already enrolled
      const existing = await prisma.enrollment.findFirst({
        where: {
          studentId: student.id,
          courseId
        }
      });
  
      if (existing) {
        return res.status(400).json({ error: "Student already enrolled" });
      }
  
      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: student.id,
          courseId,
          status: "ENROLLED"
        },
        include: {
          student: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
  
      res.json({
        id: enrollment.id,
        name: enrollment.student.name,
        email: enrollment.student.email,
        status: enrollment.status,
        enrolledAt: enrollment.enrolledAt
      });
    } catch (error) {
      console.error("Error manual enrollment:", error);
      res.status(500).json({ error: "Server error" });
    }
  };
  

  
  
 

module.exports = { getTeacherCourses ,  getCourseDetails , getChapterDetails , createCourse , createChapter , createTopic,deleteTopic, deleteChapter, updateTopic, updateChapter ,getCourseSettings ,
    updateCourse , updateEnrollmentKey , updateCourseSemester , updateCourseSchool ,getEnrollments,
    enrollStudentManual
};
