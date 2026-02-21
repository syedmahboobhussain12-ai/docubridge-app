require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
console.log("MONGO URI CHECK:", process.env.MONGODB_URI ? "YES (Value exists)" : "NO (Empty!)");
console.log("------------------------------------");

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ DATABASE CONNECTED"))
    .catch(err => console.log("❌ DATABASE ERROR:", err.message));
} else {
  console.log("⚠️ WARNING: MONGODB_URI is missing!");
}

// 3. File Upload Configuration (Multer)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// --- IN-MEMORY DATABASE (Documents will move to MongoDB soon) ---
let documents = []; 

// --- API ENDPOINTS ---

// GET: Server Status Check
app.get("/api/status", (req, res) => {
  res.json({ 
    status: "Server is running", 
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected" 
  });
});

// --- AUTHENTICATION ENDPOINTS ---

// POST: Register a new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student"
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// --- DOCUMENT ENDPOINTS ---

// POST: Upload a file
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const newDoc = {
    id: Date.now().toString(),
    name: req.file.originalname, 
    documentName: req.file.originalname, 
    size: (req.file.size / (1024 * 1024)).toFixed(1) + " MB",
    uploadedAt: new Date().toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    }),
    submittedAt: new Date().toLocaleString(), 
    status: "pending",
    type: path.extname(req.file.originalname).toUpperCase().replace(".", ""),
    tags: [],
    path: req.file.path,
  };

  documents.unshift(newDoc); 
  console.log(`[UPLOAD] ${newDoc.name}`);
  res.json({ message: "Upload success", document: newDoc });
});

// GET: Fetch all documents
app.get("/api/documents", (req, res) => {
  res.json(documents);
});

// PUT: Update document status
app.put("/api/documents/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const doc = documents.find((d) => d.id === id);
  if (doc) {
    doc.status = status;
    console.log(`[UPDATE] Doc ${id} status changed to ${status}`);
    res.json(doc);
  } else {
    res.status(404).json({ error: "Document not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  📂 Uploads will be saved to: ${uploadDir}
  `);
});