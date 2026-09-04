const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const verifyToken = require('../middleware/verifyToken')

router.post('/tasks', verifyToken, async (req, res) => {
    const { title, description, status } = req.body
    if (!title || !description) {
        return res.status(400).json({ error: "All fields are required" })
    }
    try {
        const newTask = new Task({ title, description, status, userId: req.user.id })
        await newTask.save()
        res.status(201).json(newTask)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error, Please try again" })
    }
})

router.get('/tasks', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id })
        res.json(tasks)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error, Please try again" })
    }
})

router.get('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: "This task not found" })
        }
        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You don't have access to this task" })
        }
        res.json(task)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error, Please try again" })
    }
})

router.put('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You don't have access to this task" })
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(updatedTask)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error, Please try again" })
    }
})

router.delete('/tasks/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        if (task.userId.toString() !== req.user.id) {
            return res.status(403).json({ error: "You don't have access to this task" })
        }

        await Task.findByIdAndDelete(req.params.id)
        res.json({ message: 'Task deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Server error, Please try again" })
    }
})

module.exports = router