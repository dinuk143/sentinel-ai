const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../models/userModel");

// ================= REGISTER =================
const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save User
    createUser(name, email, hashedPassword, (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        return res.status(201).json({
            message: "User Registered Successfully ✅"
        });

    });

};

// ================= LOGIN =================
const loginUser = async (req, res) => {

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required"
        });
    }

    findUserByEmail(email, async (err, result) => {

        if (err) {
            console.log(err);
            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.status(200).json({
            message: "Login Successful ✅",
            token
        });

    });

};

module.exports = {
    registerUser,
    loginUser
};