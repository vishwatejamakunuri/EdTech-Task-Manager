const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// ---------------- REGISTER ----------------
router.post("/register", async (req, res) => {
    const { email, password, role, teacherId } = req.body;

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        // Student MUST have teacherId
        if (role === "student" && !teacherId) {
            return res.status(400).json({ success: false, message: "Teacher ID is required for student" })
        }

        // Check teacher exists
        if (role === "student") {
            const teacher = await User.findById(teacherId)
            if (!teacher || teacher.role !== "teacher") {
                return res.status(400).json({ success: false, message: "Invalid Teacher ID" })
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            email,
            passwordHash: hashedPassword,
            role,
            teacherId: role === "student" ? teacherId : null
        })

        await newUser.save()

        res.status(201).json({ success: true, message: "User registered successfully" })
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Registration failed", error: error.message })
    }
})


// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user)
            return res.status(400).json({ success: false, message: "User not found" })

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
        if (!isPasswordValid)
            return res.status(400).json({ success: false, message: "Invalid password" })

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                teacherId: user.teacherId || null
            }
        })
    }
    catch (err) {
        return res.status(500).json({ success: false, message: "Login failed", error: err.message })
    }
})

module.exports = router
