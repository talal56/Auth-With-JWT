const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User')
const jwt = require('jsonwebtoken');

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



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Step 1: find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Step 2: compare the typed password against the stored HASH
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Step 3: credentials are correct — generate a JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },  // the "payload" — data embedded inside the token
      process.env.JWT_SECRET,                // a secret key only your server knows, used to sign it
      { expiresIn: '7d' }                    // token automatically becomes invalid after 7 days
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error, please try again' });
  }
});

module.exports = router