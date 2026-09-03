const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' })
    }
    try {
        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exist" })
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPass })
        await newUser.save()
        res.status(201).json({ message: "User registered successfully!" })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error, Try again" })
    }
})

router.get('/email-check', async (req, res) => {
    const { email } = req.query
    if (!email) {
        return res.status(400).json({ error: "Email is required" })
    }
    try {
        const existingUser = await User.findOne({ email })
        res.json({ available: !existingUser })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Server error, try again' })
    }
})

module.exports = router