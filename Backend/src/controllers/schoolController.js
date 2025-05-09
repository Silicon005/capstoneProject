const { createSchool, getAllSchools } = require("../services/schoolService");

const createSchoolHandler = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "School name is required" });
    }

    const newSchool = await createSchool(name);
    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllSchoolsHandler = async (req, res) => {
  try {
    const schools = await getAllSchools();
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createSchoolHandler, getAllSchoolsHandler };
