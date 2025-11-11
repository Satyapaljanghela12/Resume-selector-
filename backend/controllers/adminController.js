// const Admin = require("../models/Admin");
// const Student = require("../models/student");
// const Tpc = require("../models/Tpc");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// // -------------------------
// // 🟢 Admin Login
// // -------------------------
// exports.loginAdmin = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const admin = await Admin.findOne({ username });

//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: admin._id, role: "admin" },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token });
//   } catch (err) {
//     console.error("Admin login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------------
// // 👨‍🎓 Students Management
// // -------------------------
// exports.getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find().populate("userId", "email");
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching students" });
//   }
// };

// exports.updateStudent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating student" });
//   }
// };

// exports.deleteStudent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Student.findByIdAndDelete(id);
//     res.json({ message: "Student deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting student" });
//   }
// };

// // -------------------------
// // 🧑‍💼 TPC Management
// // -------------------------
// exports.getAllTpc = async (req, res) => {
//   try {
//     const tpcList = await Tpc.find().populate("user", "email");
//     res.json(tpcList);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching TPC members" });
//   }
// };

// exports.updateTpc = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updated = await Tpc.findByIdAndUpdate(id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error updating TPC" });
//   }
// };

// exports.deleteTpc = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Tpc.findByIdAndDelete(id);
//     res.json({ message: "TPC deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Error deleting TPC" });
//   }
// };


// exports.getDashboardStats = async (req, res) => {
//   try {
//     // 📊 Total Students & TPC
//     const totalStudents = await Student.countDocuments();
//     const totalTPC = await Tpc.countDocuments();

//     // 🧮 Average CGPA
//     const students = await Student.find({ cgpa: { $gt: 0 } }); // only cgpa > 0
//     let averageCGPA = 0;
//     if (students.length > 0) {
//       const sum = students.reduce((acc, s) => acc + s.cgpa, 0);
//       averageCGPA = (sum / students.length).toFixed(2);
//     }

//     // 🟢 Active Profiles (based on status field)
//     const activeProfiles = await Student.countDocuments({ status: "active" });

//     res.json({
//       totalStudents,
//       totalTPC,
//       averageCGPA,
//       activeProfiles,
//     });
//   } catch (err) {
//     console.error("Dashboard stats error:", err);
//     res.status(500).json({ message: "Error fetching dashboard stats" });
//   }
// };


const Admin = require("../models/Admin");
const Student = require("../models/student");
const Tpc = require("../models/Tpc");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");


// -------------------------
// 🟢 Admin Login
// -------------------------
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// -------------------------
// 🧍‍♂️ Get Logged-in Admin Info
// -------------------------
exports.getAdminProfile = async (req, res) => {
  try {
    // JWT middleware adds req.user
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json(admin);
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    res.status(500).json({ message: "Server error fetching admin info" });
  }
};

// -------------------------
// 👨‍🎓 Students Management
// -------------------------
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("userId", "email");
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ message: "Error fetching students" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Error updating student" });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Error deleting student" });
  }
};

// -------------------------
// 🧑‍💼 TPC Management
// -------------------------
exports.getAllTpc = async (req, res) => {
  try {
    const tpcList = await Tpc.find().populate("user", "email");
    res.json(tpcList);
  } catch (err) {
    console.error("Error fetching TPC members:", err);
    res.status(500).json({ message: "Error fetching TPC members" });
  }
};

exports.updateTpc = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Tpc.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error("Error updating TPC:", err);
    res.status(500).json({ message: "Error updating TPC" });
  }
};

exports.deleteTpc = async (req, res) => {
  try {
    const { id } = req.params;
    await Tpc.findByIdAndDelete(id);
    res.json({ message: "TPC deleted" });
  } catch (err) {
    console.error("Error deleting TPC:", err);
    res.status(500).json({ message: "Error deleting TPC" });
  }
};

// -------------------------
// 📊 Dashboard Stats (Fixed)
// -------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    // Import fix
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTPC = await User.countDocuments({ role: "tpc" });

    const activeProfiles = await User.countDocuments({
      role: "student",
      $or: [
        { status: "active" },
        { resume: { $exists: true, $ne: "" } },
        { resumeFile: { $exists: true } },
      ],
    });

    const pendingApprovals = await User.countDocuments({
      role: "student",
      status: "pending",
    });

    const students = await User.find({ role: "student" }, "cgpa").lean();
    const cgpas = students
      .map((s) => {
        const num = parseFloat(s.cgpa);
        return !isNaN(num) ? num : null;
      })
      .filter((n) => n !== null);

    const averageCGPA =
      cgpas.length > 0 ? (cgpas.reduce((a, b) => a + b, 0) / cgpas.length).toFixed(2) : "0.00";

    res.json({
      totalStudents,
      totalTPC,
      activeProfiles,
      pendingApprovals,
      averageCGPA,
    });
  } catch (err) {
    console.error("Stats fetch error:", err.message, err.stack);
    res.status(500).json({ message: "Failed to load stats" });
  }
};
