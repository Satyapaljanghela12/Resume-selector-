// // backend/middlewares/authMiddleware.js
// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Admin/TPC model
// const Student = require('../models/Studentprofile') // Student model

// // ====================================
// // 🔐 Authentication Middleware
// // ====================================
// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Not authorized, no token provided' });
//     }

//     const token = authHeader.split(' ')[1];

//     if (!process.env.JWT_SECRET) {
//       console.error('❌ JWT_SECRET missing in .env');
//       return res.status(500).json({ message: 'Server configuration error' });
//     }

//     // ✅ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Attach user based on role
//     let user = null;
//     if (decoded.role === 'student') {
//       user = await Student.findById(decoded.id).select('-password');
//     } else {
//       user = await User.findById(decoded.id).select('-passwordHash');
//     }

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // ✅ Attach decoded + DB data to request
//     req.user = {
//       id: user._id,
//       role: decoded.role,
//       name: user.name || '',
//       email: user.email || '',
//     };

//     next();
//   } catch (err) {
//     console.error('❌ AuthMiddleware error:', err.message);
//     return res.status(401).json({ message: 'Not authorized, token invalid' });
//   }
// };

// // ====================================
// // 🎭 Role-based Authorization Middleware
// // ====================================
// const requireRole = (roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Not authorized' });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Access denied: insufficient permissions' });
//     }

//     next();
//   };
// };

// // ====================================
// // ✅ Export All
// // ====================================
// module.exports = { authMiddleware, requireRole };

// const jwt = require("jsonwebtoken");
// const User = require("../models/user"); // Single unified model

// // ====================================
// // 🔐 Authentication Middleware
// // ====================================
// const authMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Not authorized, no token provided" });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!process.env.JWT_SECRET) {
//       console.error("❌ JWT_SECRET missing in .env");
//       return res.status(500).json({ message: "Server configuration error" });
//     }

//     // ✅ Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ Find user in database
//     const user = await User.findById(decoded.id).select("-password -passwordHash");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // ✅ Attach user info to request
//     req.user = {
//       id: user._id,
//       role: decoded.role || user.role,
//       name: user.name,
//       email: user.email,
//     };

//     next();
//   } catch (err) {
//     console.error("❌ AuthMiddleware error:", err.message);
//     return res.status(401).json({ message: "Not authorized, token invalid" });
//   }
// };

// // ====================================
// // 🎭 Role-based Authorization Middleware
// // ====================================
// const requireRole = (roles) => {
//   return (req, res, next) => {
//     if (!req.user) return res.status(401).json({ message: "Not authorized" });
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Access denied: insufficient permissions" });
//     }
//     next();
//   };
// };

// // ====================================
// // 👑 Admin-only Middleware
// // ====================================
// const requireAdmin = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Not authorized" });
//   }
//   if (req.user.role !== "admin") {
//     return res.status(403).json({ message: "Access denied: Admins only" });
//   }
//   next();
// };

// // ====================================
// // ✅ Export
// // ====================================
// module.exports = { authMiddleware, requireRole, requireAdmin };


const jwt = require("jsonwebtoken");
const User = require("../models/user"); // unified User model

// ====================================
// 🔐 Authentication Middleware
// ====================================
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing in .env");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user
    const user = await User.findById(decoded.id).select("-password -passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = {
      id: user._id,
      role: decoded.role || user.role,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error("❌ AuthMiddleware error:", err.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

// ====================================
// 🎭 Role Authorization
// ====================================
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
