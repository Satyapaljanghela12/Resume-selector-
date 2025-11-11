// backend/controllers/tpcController.js
const User = require('../models/user');
const Shortlist = require('../models/shortlist');
const Tpc = require('../models/Tpc');

// ===========================
// Get TPC Profile
// ===========================
exports.getProfile = async (req, res) => {
  try {
    const user = req.user; // populated by authMiddleware
    res.json({
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || "Not Assigned",
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading profile", error: err.message });
  }
};
;


// ===========================
// Get TPC User Profile
// ===========================
exports.getTPCProfile = async (req, res) => {
  try {
    const user = await require('../models/user').findById(req.user.id).select('-passwordHash');
    if (!user || user.role !== 'tpc') {
      return res.status(404).json({ message: 'TPC user not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching TPC profile', error: err.message });
  }
};


// ===========================
// Get Dashboard Statistics
// ===========================
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const resumesUploaded = await User.countDocuments({ role: 'student', resume: { $exists: true, $ne: null } });
    const shortlisted = await Shortlist.countDocuments();

    res.json({
      totalStudents,
      activeProfiles: totalStudents,
      resumesUploaded,
      shortlisted,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

// ===========================
// Search Students (by filters)
// ===========================
exports.searchStudents = async (req, res) => {
  try {
    const { skill, branch, year, cgpaMin, cgpaMax } = req.query;

    const filter = { role: 'student' };

    if (branch) filter.branch = branch;
    if (year) filter.year = year;
    if (cgpaMin || cgpaMax) {
      filter.cgpa = {};
      if (cgpaMin) filter.cgpa.$gte = parseFloat(cgpaMin);
      if (cgpaMax) filter.cgpa.$lte = parseFloat(cgpaMax);
    }
    if (skill) filter.skills = { $regex: skill, $options: 'i' };

    const students = await User.find(filter).select('-passwordHash');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error searching students', error: err.message });
  }
};

// ===========================
// Get Single Student Profile
// ===========================
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-passwordHash');
    if (!student || student.role !== 'student')
      return res.status(404).json({ message: 'Student not found' });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student profile', error: err.message });
  }
};

// ===========================
// Shortlist a Student
// ===========================
exports.shortlistStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await Shortlist.findOne({ studentId: id });
    if (exists) return res.status(400).json({ message: 'Already shortlisted' });

    const newEntry = await Shortlist.create({
      studentId: id,
      createdBy: req.user.id,
    });

    res.json({ message: 'Student shortlisted', data: newEntry });
  } catch (err) {
    res.status(500).json({ message: 'Error shortlisting student', error: err.message });
  }
};

// ===========================
// Remove Shortlisted Student
// ===========================
exports.removeShortlist = async (req, res) => {
  try {
    const { id } = req.params;
    await Shortlist.findOneAndDelete({ studentId: id });
    res.json({ message: 'Removed from shortlist' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing shortlist', error: err.message });
  }
};

// ===========================
// Get All Shortlisted Students
// ===========================
exports.getShortlisted = async (req, res) => {
  try {
    const shortlisted = await Shortlist.find()
      .populate('studentId', '-passwordHash');
    const formatted = shortlisted.map(s => s.studentId);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching shortlisted', error: err.message });
  }
};

// serach filter 
// ✅ controllers/tpcController.js
exports.searchStudents = async (req, res) => {
  try {
    const { skill, branch, year, cgpaMin, cgpaMax } = req.query;

    const filter = { role: "student" };

    // 🎓 Branch filter
    if (branch && branch.trim() !== "") {
      filter.branch = branch.trim();
    }

    // 📅 Year filter
    if (year && year.trim() !== "") {
      const parsedYear = Number(year);
      if (!isNaN(parsedYear)) filter.year = parsedYear;
    }

    // 📊 CGPA range filter
    if (cgpaMin || cgpaMax) {
      filter.cgpa = {};
      if (cgpaMin) filter.cgpa.$gte = parseFloat(cgpaMin);
      if (cgpaMax) filter.cgpa.$lte = parseFloat(cgpaMax);
    }

    // 🧠 Skill filter
    if (skill && skill.trim() !== "") {
      const regex = new RegExp(skill.trim(), "i");
      filter.$or = [
        { skills: { $in: [regex] } }, // if array
        { skills: { $regex: regex } } // if single string
      ];
    }

    const students = await User.find(filter).select("-passwordHash");

    // ✅ Always return JSON (even if no students)
    res.json(students);
  } catch (err) {
    console.error("❌ Error searching students:", err);
    res.status(500).json({ message: "Error searching students", error: err.message });
  }
};
