const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();


const addManualQuestion = async (req, res) => {
  try {
    const { text, level, type, options, correctAnswer, topicId } = req.body;

    if (!text || !level || !type || !options || !correctAnswer || !topicId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!Array.isArray(options)) {
      return res.status(400).json({ error: "Options must be an array" });
    }

    // Ensure options contain correctAnswer
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ error: "correctAnswer must be one of the options" });
    }

    // Fetch related courseId and teacherId using topicId
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        chapter: {
          include: {
            course: true, // Fetch the course
          },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({ error: "Topic not found" });
    }

    const courseId = topic.chapter.course.id;
    const teacherId = topic.chapter.course.teacherId; // Correct field

    // Save question in DB
    const question = await prisma.question.create({
      data: {
        text,
        level,
        type,
        options,
        correctAnswer,
        courseId,
        teacherId,
      },
    });

    return res.status(201).json({ message: "Question added successfully", question });
  } catch (error) {
    console.error("Error adding manual question:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addManualQuestion };
