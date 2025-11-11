// ==========================================
// 🌐 SERVER.JS — Main Backend Entry Point
// ==========================================

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// ==========================================
// 🔧 Load Environment Variables
// ==========================================
dotenv.config();

// ==========================================
// 🗄️ Import Database & Routes
// ==========================================
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");
const authRoutes = require("./routes/authRoutes");
const tpcRoutes = require("./routes/tpcRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ==========================================
// 📁 Ensure Uploads Folder Exists
// ==========================================
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Created uploads folder");
}

// ==========================================
// 🧩 Initialize Express App
// ==========================================
const app = express();

// ==========================================
// ⚙️ Middleware
// ==========================================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadDir)); // Serve uploaded files

// ==========================================
// 🔗 API ROUTES
// ==========================================

// ✅ Authentication routes (login/register)
app.use("/api/auth", authRoutes);

// ✅ Student-specific routes
app.use("/api/students", studentRoutes);

// ✅ TPC routes
app.use("/api/tpc", tpcRoutes);

// ✅ Admin routes (dashboard stats, manage students/TPC)
app.use("/api/admin", adminRoutes);

console.log("✅ All routes loaded successfully...");

// ==========================================
// ❗ API Fallback — should be *after* all routes!
// ==========================================
app.all(/^\/api\/.*/, (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.originalUrl}` });
});

// ==========================================
// 🌐 Serve Frontend (Static Files)
// ==========================================
const frontendPath = path.join(__dirname, "../frontend");

// ✅ Serve frontend assets (HTML, CSS, JS)
app.use(express.static(frontendPath));

// ✅ Handle any unknown routes (SPA or HTML pages)
// ✅ Handle any unknown routes (SPA or HTML pages)
app.get(/.*/, (req, res) => {
  const filePath = path.join(frontendPath, "index.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Frontend not found");
  }
});


// ==========================================
// 🚀 Start Server
// ==========================================
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("✅ MongoDB connected successfully");
      console.log(`🚀 Server running at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
