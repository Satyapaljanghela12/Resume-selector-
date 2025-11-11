const Student = require('../models/Studentprofile');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const student = require('../models/student');



// =============================
// 🟢 Register Student
// =============================
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const student = await User.create({
      name,
      email,
      passwordHash: hashed,
      role: 'student'
    });

    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// 🟠 Login Student
// =============================
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await User.findOne({ email, role: 'student' });
    if (!student) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// 🟣 Get My Profile
// =============================
exports.getMyProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-passwordHash');
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json({
      name: student.name,
      email: student.email,
      branch: student.branch,
      year: student.year,
      academicYear: student.academicYear,
      cgpa: student.cgpa,
      skills: student.skills,
      resume: student.resume ? `http://localhost:5000/${student.resume}` : '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// 🟢 Update Profile
// =============================
exports.updateMyProfile = async (req, res) => {
  try {
    const { name, branch, year, academicYear, cgpa, skills } = req.body;

    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    if (name) student.name = name;
    if (branch) student.branch = branch;
    if (year) student.year = year;
    if (academicYear) student.academicYear = academicYear;
    if (cgpa) student.cgpa = cgpa;
    if (skills) student.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());

    await student.save();

    res.json({ message: 'Profile updated successfully', student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/// =============================
// 🟡 Upload Resume (Fixed)
// =============================
// controllers/studentController.js
exports.uploadResume = async (req, res) => {
  try {
    console.log("📥 Upload request user:", req.user);

    let student = await User.findById(req.user.id);
    if (!student) {
      // try from Student model (if separate)
      const Student = require("../models/studentModel");
      student = await Student.findById(req.user.id);
    }

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    student.resume = `uploads/${req.file.filename}`;
    await student.save();

    res.json({
      message: "Resume uploaded successfully",
      resumeUrl: `http://localhost:5000/${student.resume}`,
    });
  } catch (err) {
    console.error("❌ Upload resume error:", err);
    res.status(500).json({ message: err.message });
  }
};
