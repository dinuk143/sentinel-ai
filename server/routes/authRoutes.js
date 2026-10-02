const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Profile Route
router.get("/profile", verifyToken, (req, res) => {
    res.status(200).json({ 
        message: "Welcome to Sentinel AI 🔐",
        user: req.user
    });
});

// Upload Route
router.post(
    "/upload",
    verifyToken,
    upload.single("file"),
    (req, res) => {
        res.status(200).json({
            message: "File Uploaded Successfully ✅",
            file: req.file
        });
    }
);

module.exports = router;
