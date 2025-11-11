// // backend/routes/adminRoutes.js
// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const Student = require("../models/student");
// const Tpc = require("../models/Tpc");
// const { authMiddleware, requireRole } = require("../middlewares/authMiddleware");

// // ===========================================
// // 🔐 Protect all admin routes
// // ===========================================
// // router.use(authMiddleware, requireRole(["admin"]));

// // ===========================================
// // 👑 Admin Profile
// // ===========================================
// router.get("/me", async (req, res) => {
//   try {
//     const admin = await User.findById(req.user?.id).select("-password -passwordHash");
//     if (!admin) return res.status(404).json({ message: "Admin not found" });
//     res.json(admin);
//   } catch (err) {
//     console.error("❌ Admin profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ===========================================
// // 🎓 Get All Students (for adminstudent.html)
// // ===========================================
// router.get("/students", async (req, res) => {
//   try {
//     const students = await Student.find().populate("userId", "name email").lean();

//     const formatted = students.map((s) => ({
//       _id: s._id,
//       name: s.userId?.name || s.name || "Unnamed",
//       email: s.userId?.email || s.email || "N/A",
//       branch: s.branch || "-",
//       year: s.year || "-",
//       cgpa: s.cgpa || "N/A",
//       resumeUploaded: !!s.resumeFile?.data,
//       status: s.status || "inactive", // fallback if not present
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("❌ Fetch students error:", err);
//     res.status(500).json({ message: "Failed to fetch students" });
//   }
// });

// // ===========================================
// // 🧩 Update a Student
// // ===========================================
// router.patch("/students/:id", async (req, res) => {
//   try {
//     const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: "Student not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Update student error:", err);
//     res.status(500).json({ message: "Failed to update student" });
//   }
// });

// // ===========================================
// // 🗑️ Delete a Student
// // ===========================================
// router.delete("/students/:id", async (req, res) => {
//   try {
//     const deleted = await Student.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Student not found" });
//     res.json({ message: "Student deleted successfully" });
//   } catch (err) {
//     console.error("❌ Delete student error:", err);
//     res.status(500).json({ message: "Failed to delete student" });
//   }
// });

// // ===========================================
// // 👥 Get All TPC Members (for admintpc.html)
// // ===========================================
// router.get("/tpc-members", async (req, res) => {
//   try {
//     const tpcs = await User.find({ role: "tpc" })
//       .select("name email branch role createdAt")
//       .lean();

//     res.json(tpcs);
//   } catch (err) {
//     console.error("❌ Fetch TPC error:", err);
//     res.status(500).json({ message: "Failed to fetch TPC members" });
//   }
// });

// // ===========================================
// // 🧩 Update a TPC Member
// // ===========================================
// router.patch("/tpcs/:id", async (req, res) => {
//   try {
//     const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: "TPC member not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error("❌ Update TPC error:", err);
//     res.status(500).json({ message: "Failed to update TPC member" });
//   }
// });

// // ===========================================
// // 🗑️ Delete a TPC Member
// // ===========================================
// router.delete("/tpcs/:id", async (req, res) => {
//   try {
//     const deleted = await User.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "TPC member not found" });
//     res.json({ message: "TPC member deleted successfully" });
//   } catch (err) {
//     console.error("❌ Delete TPC error:", err);
//     res.status(500).json({ message: "Failed to delete TPC member" });
//   }
// });

// // ===========================================
// // 📊 Dashboard Stats (for admindashboard.html)
// // ===========================================
// router.get("/stats", async (req, res) => {
//   try {
//     const totalStudents = await Student.countDocuments();
//     const totalTPC = await User.countDocuments({ role: "tpc" });

//     // Fix: handle cases where 'status' might not exist
//     const activeProfiles = await Student.countDocuments({
//       $or: [{ status: "active" }, { resumeFile: { $exists: true, $ne: null } }],
//     });

//     const pendingApprovals = await Student.countDocuments({ status: "pending" });

//     // Fix: Convert cgpa properly
//     const students = await Student.find({}, "cgpa").lean();
//     const validCGPAs = students
//       .map((s) => parseFloat(s.cgpa))
//       .filter((n) => !isNaN(n));

//     const averageCGPA =
//       validCGPAs.length > 0
//         ? (validCGPAs.reduce((a, b) => a + b, 0) / validCGPAs.length).toFixed(2)
//         : "0.00";

//     res.json({
//       totalStudents,
//       totalTPC,
//       activeProfiles,
//       pendingApprovals,
//       averageCGPA,
//     });
//   } catch (err) {
//     console.error("❌ Stats fetch error:", err);
//     res.status(500).json({ message: "Failed to load stats" });
//   }
// });

// module.exports = router;
// backend/routes/adminRoutes.js
// =============================================
// 🧩 Admin Routes
// =============================================
// const express = require("express");
// const router = express.Router();
// const User = require("../models/user");
// const Student = require("../models/student");
// const Tpc = require("../models/Tpc");
// const { authMiddleware, requireRole } = require("../middlewares/authMiddleware");

// // ✅ Enforce admin authentication for all routes
// router.use(authMiddleware, requireRole(["admin"]));

// // =============================================
// // 👤 Get Admin Profile
// // =============================================
// router.get("/me", async (req, res) => {
//   try {
//     const admin = await User.findById(req.user.id).select("-password -passwordHash");
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     res.json({
//       id: admin._id,
//       name: admin.name,
//       email: admin.email,
//       role: admin.role,
//     });
//   } catch (err) {
//     console.error("Admin profile error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // =============================================
// // 🎓 List All Students
// // =============================================
// router.get("/students", async (req, res) => {
//   try {
//     const students = await Student.find().populate("userId", "name email").lean();

//     const formatted = students.map((s) => ({
//       _id: s._id,
//       name: s.userId?.name || s.name || "Unnamed",
//       email: s.userId?.email || s.email || "N/A",
//       branch: s.branch || "-",
//       year: s.year || "-",
//       cgpa: typeof s.cgpa === "number" ? s.cgpa : parseFloat(s.cgpa) || 0,
//       resumeUploaded: !!(s.resume || (s.resumeFile && s.resumeFile.data)),
//       status: s.status || "inactive",
//     }));

//     res.json(formatted);
//   } catch (err) {
//     console.error("Fetch students error:", err);
//     res.status(500).json({ message: "Failed to fetch students" });
//   }
// });

// // =============================================
// // ✏️ Update Student
// // =============================================
// router.patch("/students/:id", async (req, res) => {
//   try {
//     const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: "Student not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error("Update student error:", err);
//     res.status(500).json({ message: "Failed to update student" });
//   }
// });

// // =============================================
// // ❌ Delete Student
// // =============================================
// router.delete("/students/:id", async (req, res) => {
//   try {
//     const deleted = await Student.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Student not found" });
//     res.json({ message: "Student deleted successfully" });
//   } catch (err) {
//     console.error("Delete student error:", err);
//     res.status(500).json({ message: "Failed to delete student" });
//   }
// });

// // =============================================
// // 👥 Get All TPC Members
// // =============================================
// router.get("/tpc-members", async (req, res) => {
//   try {
//     const tpcs = await User.find({ role: "tpc" })
//       .select("name email branch role createdAt")
//       .lean();
//     res.json(tpcs);
//   } catch (err) {
//     console.error("Fetch TPC error:", err);
//     res.status(500).json({ message: "Failed to fetch TPC members" });
//   }
// });

// // =============================================
// // 🛠️ Update or Delete TPC Member
// // =============================================
// router.patch("/tpcs/:id", async (req, res) => {
//   try {
//     const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updated) return res.status(404).json({ message: "TPC member not found" });
//     res.json(updated);
//   } catch (err) {
//     console.error("Update TPC error:", err);
//     res.status(500).json({ message: "Failed to update TPC member" });
//   }
// });

// router.delete("/tpcs/:id", async (req, res) => {
//   try {
//     const deleted = await User.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "TPC member not found" });
//     res.json({ message: "TPC member deleted successfully" });
//   } catch (err) {
//     console.error("Delete TPC error:", err);
//     res.status(500).json({ message: "Failed to delete TPC member" });
//   }
// });

// // =============================================
// // 📊 Dashboard Stats
// // =============================================
// router.get("/stats", adminController.getDashboardStats);

//   try {
//     const totalStudents = await Student.countDocuments();
//     const totalTPC = await User.countDocuments({ role: "tpc" });

//     // Active profile logic
//     const activeProfiles = await Student.countDocuments({
//       $or: [
//         { status: "active" },
//         { resume: { $exists: true, $ne: "" } },
//         { "resumeFile.data": { $exists: true } },
//       ],
//     });

//     const pendingApprovals = await Student.countDocuments({ status: "pending" });

//     // Calculate average CGPA
//     const students = await Student.find({}, "cgpa").lean();
//     const cgpas = students
//       .map((s) => (typeof s.cgpa === "number" ? s.cgpa : parseFloat(s.cgpa)))
//       .filter((n) => !isNaN(n));

//     const averageCGPA =
//       cgpas.length > 0 ? (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2) : "0.00";

//     res.json({
//       totalStudents,
//       totalTPC,
//       activeProfiles,
//       pendingApprovals,
//       averageCGPA,
//     });
//   } catch (err) {
//     console.error("Stats fetch error:", err);
//     res.status(500).json({ message: "Failed to load stats" });
//   }
// });

// // =============================================
// // 🧪 Debug Route (Optional)
// // =============================================
// router.get("/debug-students", async (req, res) => {
//   try {
//     const sample = await Student.find().limit(10).lean();
//     const total = await Student.countDocuments();
//     const activeStatusCount = await Student.countDocuments({ status: "active" });
//     const resumeCount = await Student.countDocuments({ resume: { $exists: true, $ne: "" } });
//     res.json({ total, activeStatusCount, resumeCount, sample });
//   } catch (err) {
//     console.error("DEBUG error:", err);
//     res.status(500).json({ message: "debug error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Student = require("../models/student");
const Tpc = require("../models/Tpc");
const { authMiddleware, requireRole } = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

// ✅ Enforce admin authentication for all admin routes
router.use(authMiddleware, requireRole(["admin"]));

// =============================================
// 👤 Get Admin Profile
// =============================================
router.get("/me", async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password -passwordHash");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } catch (err) {
    console.error("Admin profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// =============================================
// 🎓 List All Students
// =============================================
router.get("/students", async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).lean();

    const formatted = students.map((s) => ({
      _id: s._id,
      name: s.name || "Unnamed",
      email: s.email || "N/A",
      branch: s.branch || "-",
      year: s.year || "-",
      cgpa: typeof s.cgpa === "number" ? s.cgpa : parseFloat(s.cgpa) || 0,
      resumeUploaded: !!(s.resume || (s.resumeFile && s.resumeFile.data)),
      status: s.status || "inactive",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Fetch students error:", err);
    res.status(500).json({ message: "Failed to fetch students" });
  }
});


// =============================================
// ✏️ Update Student
// =============================================
router.patch("/students/:id", async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update student error:", err);
    res.status(500).json({ message: "Failed to update student" });
  }
});

// =============================================
// ❌ Delete Student
// =============================================
router.delete("/students/:id", async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err);
    res.status(500).json({ message: "Failed to delete student" });
  }
});

// =============================================
// 👥 Get All TPC Members
// =============================================
router.get("/tpc-members", async (req, res) => {
  try {
    const tpcs = await User.find({ role: "tpc" })
      .select("name email branch role createdAt")
      .lean();
    res.json(tpcs);
  } catch (err) {
    console.error("Fetch TPC error:", err);
    res.status(500).json({ message: "Failed to fetch TPC members" });
  }
});

// =============================================
// 🛠️ Update or Delete TPC Member
// =============================================
router.patch("/tpcs/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "TPC member not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update TPC error:", err);
    res.status(500).json({ message: "Failed to update TPC member" });
  }
});

router.delete("/tpcs/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "TPC member not found" });
    res.json({ message: "TPC member deleted successfully" });
  } catch (err) {
    console.error("Delete TPC error:", err);
    res.status(500).json({ message: "Failed to delete TPC member" });
  }
});

// =============================================
// 📊 Dashboard Stats
// =============================================
// ✅ Just connect to controller function
router.get("/stats", adminController.getDashboardStats);

// =============================================
// 🧪 Debug Route (Optional)
// =============================================
router.get("/debug-students", async (req, res) => {
  try {
    const sample = await Student.find().limit(10).lean();
    const total = await Student.countDocuments();
    const activeStatusCount = await Student.countDocuments({ status: "active" });
    const resumeCount = await Student.countDocuments({ resume: { $exists: true, $ne: "" } });
    res.json({ total, activeStatusCount, resumeCount, sample });
  } catch (err) {
    console.error("DEBUG error:", err);
    res.status(500).json({ message: "debug error" });
  }
});

module.exports = router;
