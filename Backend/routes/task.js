// server/routes/tasks.js

const express = require("express")
const router = express.Router()

const Task = require("../models/Task")
const User = require("../models/User")
const auth = require("../middleware/auth")

// ------------------------------------------------------
// GET /tasks → student: own tasks | teacher: own + students
// ------------------------------------------------------
router.get("/", auth, async (req, res) => {
    try {
        const { userId, role } = req.user
        let query = {}

        if (role === "student") {
            query = { userId }
            console.log(userId)
        } else {
            // teacher → own tasks + tasks of assigned students
            const students = await User.find({teacherId: userId}).select("_id")
            const studentIds = students.map(s => s._id)

            query = { $or: [{ userId }, { userId: { $in: studentIds } }] }
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 })
        res.json({ success: true, tasks })
    } 
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "cannot get tasks" })
    }
})


// ------------------------------------------------------
// POST /tasks → create task
// ------------------------------------------------------
router.post("/", auth, async (req, res) => {
    try {
        const { userId } = req.user
        const { title, description, dueDate, progress } = req.body

        if (!title) {
            return res.status(400).json({ success: false, message: "title required" })
        }

        const task = new Task({
            userId,
            title,
            description,
            dueDate: dueDate ? new Date(dueDate) : null,
            progress: progress || "not-started"
        })

        await task.save()
        res.status(201).json({ success: true, message: "task created", task })
    } 
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "cannot create task" })
    }
})


// ------------------------------------------------------
// PUT /tasks/:id → update task (only owner)
// ------------------------------------------------------
router.put("/:id", auth, async (req, res) => {
    try {
        const { userId } = req.user
        const { id } = req.params
        const { title, description, dueDate, progress } = req.body

        const task = await Task.findById(id)
        if (!task) return res.status(404).json({ success: false, message: "task not found" })

        if (task.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "not allowed" })
        }

        if (title) task.title = title
        if (description) task.description = description
        if (progress) task.progress = progress
        if (dueDate) task.dueDate = new Date(dueDate)

        await task.save()
        res.json({ success: true, message: "task updated", task })
    } 
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "cannot update task" })
    }
})


// ------------------------------------------------------
// DELETE /tasks/:id → delete task (only owner)
// ------------------------------------------------------
router.delete("/:id", auth, async (req, res) => {
    try {
        const { userId } = req.user
        const { id } = req.params

        const task = await Task.findById(id)
        if (!task) return res.status(404).json({ success: false, message: "task not found" })

        if (task.userId.toString() !== userId) {
            return res.status(403).json({ success: false, message: "not allowed" })
        }

        await task.deleteOne()
        res.json({ success: true, message: "task deleted" })
    } 
    catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "cannot delete task" })
    }
})

module.exports = router
