const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Set Cookie
const setCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
};

// Register
const register = async (req, res) => {
    try {
        const { name, email, password, photoURL } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email.' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            photoURL
        });

        res.status(201).json({ 
            message: 'Registration successful! Please login.' 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                message: 'Invalid email or password.' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                message: 'Invalid email or password.' 
            });
        }

        // Generate token and set cookie
        const token = generateToken(user._id);
        setCookie(res, token);

        res.status(200).json({
            message: 'Login successful!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Google Login
const googleLogin = async (req, res) => {
    try {
        const { name, email, photoURL } = req.body;

        // Check if user exists, if not create one
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                photoURL,
                password: null
            });
        }

        // Generate token and set cookie
        const token = generateToken(user._id);
        setCookie(res, token);

        res.status(200).json({
            message: 'Login successful!',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Logout
const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully.' });
};

// Get Current User
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, googleLogin, logout, getMe };