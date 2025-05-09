const bcrypt = require("bcryptjs");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, passwordHash: hashedPassword, role },
    });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ message: "User registered and logged in", user });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info.message });

    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Logged out successfully" });
  });
};

module.exports = { register, login, logout };
