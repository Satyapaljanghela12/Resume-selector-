// backend/routes/tpcRoutes.js
const express = require("express");
const router = express.Router();

const {
  getProfile,
  getStats,
  searchStudents,
  getStudentProfile,
  shortlistStudent,
  removeShortlist,
  getShortlisted,
} = require("../controllers/tpcController");

const { authMiddleware, requireRole } = require("../middlewares/authMiddleware");

// ✅ All routes require JWT + TPC role
router.use(authMiddleware, requireRole(["tpc"]));

// ✅ TPC routes
router.get("/profile", getProfile);
router.get("/stats", getStats);
router.get("/students", searchStudents);
router.get("/students/:id", getStudentProfile);
router.post("/students/:id/shortlist", shortlistStudent);
router.delete("/students/:id/shortlist", removeShortlist);
router.get("/shortlisted", getShortlisted);

module.exports = router;
