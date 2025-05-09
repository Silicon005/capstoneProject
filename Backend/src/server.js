const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const authRoutes = require("./routes/auth.routes");
const cors = require('cors');
const schoolRoutes = require("./routes/schoolRoutes");
const sessionTimeoutMiddleware = require("./middleware/session.middleware");
const teacherRoutes = require('./routes/course.routes');
const testRoutes = require('./routes/testRoutes');
const questionRoutes = require("./routes/questionRoutes");
const manualQuestion = require("./routes/manualtestRoutes");
const getsemesterRoutes = require("./routes/getsemesterRoutes");
const getschoolRoutes = require("./routes/getschoolRoutes");
const teacherDashboardRoutes = require("./routes/teacherDashboard.route");
const userRoutes = require("./routes/user.routes");

const redis = require("./utils/redis"); 
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
// const serverless = require("serverless-http");

const prisma = new PrismaClient();
const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));
app.use(express.json());
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(sessionTimeoutMiddleware);

app.use("/auth", authRoutes);
app.use("/api", schoolRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/test", testRoutes);
app.use("/api/manualQuestion", manualQuestion);
app.use("/api", getsemesterRoutes);
app.use("/api", getschoolRoutes); 
app.use("/api", questionRoutes);
app.use("/api", teacherDashboardRoutes);
app.use("/api", userRoutes);


app.get("/api/notifications/:teacherId", async (req, res) => {
  try {
      const { teacherId } = req.params;
      console.log("Teacher ID:", teacherId);
      const notifications = await prisma.notification.findMany({
          where: { userId: teacherId },
          orderBy: { createdAt: "desc" }
      });

      return res.json({ success: true, notifications });
  } catch (error) {
      console.error("Error fetching notifications:", error);
      return res.status(500).json({ error: "Server error" });
  }
});


// Get unseen notifications count
app.get("/api/notifications/unseen/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const unseen = await prisma.notification.findMany({
      where: {
        userId,
        seen: false,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      count: unseen.length,
      notifications: unseen,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch unseen notifications" });
  }
});

// Mark notifications as seen
app.post("/api/notifications/mark-seen/:teacherId", async (req, res) => {
  try {
      const { teacherId } = req.params;
      console.log("Marking notifications as seen for Teacher ID:", teacherId);

      // Update the notifications to mark them as seen
      await prisma.notification.updateMany({
          where: { userId: teacherId, seen: false },
          data: { seen: true } // Assuming you have a 'seen' column to update
      });

      return res.json({ success: true, message: "Notifications marked as seen" });
  } catch (error) {
      console.error("Error marking notifications as seen:", error);
      return res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/notifications/stream/:userId", async (req, res) => {
  const userId = req.params.userId;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*"); // Only if needed

  res.flushHeaders();

  // Optional: Send a ping every 20s to keep connection alive
  const keepAlive = setInterval(() => {
    res.write(":\n\n"); // SSE comment
  }, 20000);

  const subscriber = redis.duplicate();

  try {
    await subscriber.connect();
    const channel = `notifications:${userId}`;

    await subscriber.subscribe(channel, (message) => {
      res.write(`data: ${message}\n\n`);
    });

    req.on("close", async () => {
      clearInterval(keepAlive);
      await subscriber.unsubscribe(channel);
      await subscriber.quit();
      res.end();
    });

  } catch (err) {
    console.error("Redis subscriber error:", err);
    res.status(500).end();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// module.exports.handler = serverless(app); 
