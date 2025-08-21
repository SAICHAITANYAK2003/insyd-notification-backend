require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());
// ✅ Configure CORS explicitly

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define schemas
const userSchema = new mongoose.Schema({
  userId: String,
  username: String,
  email: String,
  preferences: { inApp: Boolean, email: Boolean },
});
const notificationSchema = new mongoose.Schema({
  notificationId: String,
  userId: String,
  type: String,
  content: String,
  status: String,
  timestamp: Date,
});
const eventSchema = new mongoose.Schema({
  eventId: String,
  type: String,
  sourceUserId: String,
  targetUserId: String,
  data: Object,
  timestamp: Date,
});

const User = mongoose.model("User", userSchema);
const Notification = mongoose.model("Notification", notificationSchema);
const Event = mongoose.model("Event", eventSchema);

// In-memory queue for POC
let eventQueue = [];

// Process events every 2 seconds
setInterval(async () => {
  if (eventQueue.length > 0) {
    const event = eventQueue.shift();
    const { type, sourceUserId, targetUserId, data } = event;
    const user = await User.findOne({ userId: targetUserId });
    if (user && user.preferences.inApp) {
      const notification = new Notification({
        notificationId: uuidv4(),
        userId: targetUserId,
        type,
        content: `${data.sourceUsername} ${type}d your post`,
        status: "sent",
        timestamp: new Date(),
      });
      await notification.save();
    }
  }
}, 2000);

// API Endpoints

app.get("/", (req, res) => {
  res.send("App is working");
});

app.post("/events", async (req, res) => {
  const { type, sourceUserId, targetUserId, data } = req.body;
  const event = new Event({
    eventId: uuidv4(),
    type,
    sourceUserId,
    targetUserId,
    data,
    timestamp: new Date(),
  });
  await event.save();
  eventQueue.push(event);
  res.status(201).json({ message: "Event created" });
});

app.get("/notifications/:userId", async (req, res) => {
  const notifications = await Notification.find({
    userId: req.params.userId,
  }).sort({ timestamp: -1 });
  res.json(notifications);
});

app.post("/notifications", async (req, res) => {
  const { userId, type, content } = req.body;
  const notification = new Notification({
    notificationId: uuidv4(),
    userId,
    type,
    content,
    status: "sent",
    timestamp: new Date(),
  });
  await notification.save();
  res.status(201).json({ message: "Notification created" });
});

// Initialize mock users
async function initializeUsers() {
  const users = [
    {
      userId: "user1",
      username: "Alice",
      email: "alice@example.com",
      preferences: { inApp: true, email: false },
    },
    {
      userId: "user2",
      username: "Bob",
      email: "bob@example.com",
      preferences: { inApp: true, email: false },
    },
  ];
  await User.deleteMany({});
  await User.insertMany(users);
}

const port = process.env.PORT || 4000;

app.listen(port, async () => {
  await initializeUsers();
  console.log("Server running on port 4000");
});
