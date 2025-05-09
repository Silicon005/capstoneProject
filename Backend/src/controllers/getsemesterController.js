const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // Ensure Prisma Client is imported
const getSemesters = async (req, res) => {
    try {
      const semesters = await prisma.semester.findMany(); // Fetch all semesters
      res.status(200).json(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      res.status(500).json({ error: "Failed to fetch semesters" });
    }
  };
  
  module.exports = { getSemesters };
