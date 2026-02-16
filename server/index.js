const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;
// 1. Allow React (port 5173) to talk to this Server (port 5000)
app.use(cors());
app.use(express.json());

// 2. Ensure 'uploads' folder exists so files don't get lost
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 3. Configure Storage (Where files go)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Save as: timestamp-filename.pdf to prevent duplicates
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// --- IN-MEMORY DATABASE (Resets when server restarts) ---
// In a real app, this would be MongoDB or PostgreSQL
let documents = []; 

// --- API ENDPOINTS ---

// POST: Student uploads a file
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const newDoc = {
    id: Date.now().toString(),
    name: req.file.originalname, // Matches StudentDashboard 'name'
    documentName: req.file.originalname, // Matches MentorDashboard 'documentName'
    size: (req.file.size / (1024 * 1024)).toFixed(1) + " MB",
    uploadedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    submittedAt: new Date().toLocaleString(), // Detailed time for Mentor view
    status: "pending",
    type: path.extname(req.file.originalname).toUpperCase().replace(".", ""),
    tags: [],
    path: req.file.path,
  };

  documents.unshift(newDoc); // Add to top of list
  console.log(`[UPLOAD] ${newDoc.name}`);
  res.json({ message: "Upload success", document: newDoc });
});

// GET: Fetch all documents (For Mentor & Student)
app.get("/api/documents", (req, res) => {
  res.json(documents);
});

// PUT: Mentor updates status (Approve/Reject)
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

// Start the engine
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on http://localhost:${PORT}
  📂 Uploads will be saved to: ${uploadDir}
  `);
});