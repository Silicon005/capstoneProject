const express = require("express");
const { register, login, logout } = require("../controllers/auth.controller");
const { isAuthenticated } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", isAuthenticated, (req, res) => res.json(req.user));

module.exports = router;
