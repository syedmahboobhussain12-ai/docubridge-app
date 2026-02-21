require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ADDED for authentication tokens

// Import the User model
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection
console.log("------------------------------------");
console.log("SERVER BOOTING UP...");
console.log("MONGO URI CHECK:", process.env.MONGODB_URI ? "YES" : "NO");
console.log("------------------------------------");

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ DATABASE CONNECTED"))
    .catch(err => console.error("❌ DATABASE ERROR:", err.message));
}

// 3. File Upload Configuration
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// In-memory docs for now (will move to MongoDB in the next step)
let documents = []; 

// --- API ENDPOINTS ---

app.get("/api/status", (req, res) => {
  res.json({ 
    status: "Server is running", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" 
  });
});

// --- AUTHENTICATION ROUTES ---

// 1. REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword, role: role || "student" });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
});

// 2. LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// --- DOCUMENT ROUTES ---

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const newDoc = {
    id: Date.now().toString(),
    name: req.file.originalname, 
    size: (req.file.size / (1024 * 1024)).toFixed(1) + " MB",
    uploadedAt: new Date().toLocaleDateString(),
    status: "pending",
    type: path.extname(req.file.originalname).toUpperCase().replace(".", ""),
    path: req.file.path,
  };

  documents.unshift(newDoc);
  res.json({ message: "Upload success", document: newDoc });
});

app.get("/api/documents", (req, res) => res.json(documents));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});