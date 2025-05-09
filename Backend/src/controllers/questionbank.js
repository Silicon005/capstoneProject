const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getQuestions = async (req, res) => {
  try {
    const { sortBy = "createdAt", order = "desc" } = req.query;

    const validSortFields = ["text", "level", "topic", "createdAt"];
    if (!validSortFields.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sort field" });
    }

    const questions = await prisma.question.findMany({
      select: {
        id: true,
        text: true,
        options: true,
        correctAnswer: true,
        level: true,
        topic: true,
        createdAt: true,
      },
      orderBy: {
        [sortBy]: order === "asc" ? "asc" : "desc",
      },
    });

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
