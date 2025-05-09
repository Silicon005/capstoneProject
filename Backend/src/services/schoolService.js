const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createSchool = async (name) => {
  try {
    const school = await prisma.school.create({
      data: { name },
    });
    return school;
  } catch (error) {
    throw new Error("Error creating school: " + error.message);
  }
};

const getAllSchools = async () => {
  return await prisma.school.findMany();
};

module.exports = { createSchool, getAllSchools };
