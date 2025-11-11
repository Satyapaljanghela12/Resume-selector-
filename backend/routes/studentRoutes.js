// // backend/routes/studentRoutes.js
// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// const {
//   registerStudent,
//   loginStudent,
//   getMyProfile,
//   updateMyProfile,   // ✅ make sure this is here
//   uploadResume,
// } = require('../controllers/studentController');

// const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// // ==============================
// // 📂 Multer File Upload Setup
// // ==============================
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueName + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // ==============================
// // 🚀 Student Routes
// // ==============================

// // 🔹 Register a new student
// router.post('/register', registerStudent);

// // 🔹 Login student
// router.post('/login', loginStudent);

// // 🔹 Get logged-in student's profile
// router.get('/me', authMiddleware, requireRole(['student']), getMyProfile);

// // 🔹 Update logged-in student's profile
// router.put('/me', authMiddleware, requireRole(['student']), updateMyProfile);

// // 🔹 Upload student resume
// router.post(
//   '/upload-resume',
//   authMiddleware,
//   requireRole(['student']),
//   upload.single('resume'),
//   uploadResume
// );

// module.exports = router;
// backend/routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  registerStudent,
  loginStudent,
  getMyProfile,
  updateMyProfile,
  uploadResume,
} = require('../controllers/studentController');

const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

// ==============================
// 📂 Multer File Upload Setup (Fixed)
// ==============================
const uploadDir = path.join(__dirname, '../uploads');

// ✅ Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ Correct absolute path
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ==============================
// 🚀 Student Routes
// ==============================

// 🔹 Register a new student
router.post('/register', registerStudent);

// 🔹 Login student
router.post('/login', loginStudent);

// 🔹 Get logged-in student's profile
router.get('/me', authMiddleware, requireRole(['student']), getMyProfile);

// 🔹 Update logged-in student's profile
router.put('/me', authMiddleware, requireRole(['student']), updateMyProfile);

// 🔹 Upload student resume
router.post(
  '/upload-resume',
  authMiddleware,
  requireRole(['student']),
  upload.single('resume'),
  uploadResume
);

module.exports = router;
