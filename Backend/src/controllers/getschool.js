const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // Ensure Prisma Client is imported

// ✅ Get all schools
const getSchools = async (req, res) => {
  try {
    const schools = await prisma.school.findMany();
    res.status(200).json(schools);
  } catch (error) {
    console.error("Error fetching schools:", error);
    res.status(500).json({ error: "Failed to fetch schools" });
  }
};

module.exports = { getSchools };
