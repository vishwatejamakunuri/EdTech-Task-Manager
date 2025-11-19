// server/server.js

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use("/auth", require("./routes/auth"))
app.use("/tasks", require("./routes/task"))

// Basic test route
app.get("/", (req, res) => {
    res.send("EdTech Task Manager API is running")
})

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected")
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err)
    })

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log("Server running on port", PORT)
})
