const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const crypto = require('crypto');
const { sendEmail } = require('../services/emailService'); // Your email service

// Register User


// Middleware to create or verify Google user
const verifyGoogleToken = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: 'YOUR_GOOGLE_CLIENT_ID',
    });
    const payload = ticket.getPayload();
    return payload;
};


exports.register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user with verification token and not yet verified
        const verificationToken = crypto.randomBytes(32).toString('hex');
        user = new User({
            name,
            email,
            password,
            isVerified: false, // Initially, user is not verified
            isAdmin: false, 
            verificationToken
        });

        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Create email verification link
        const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;

        // Send verification email using Resend
        await sendEmail(
            'no-reply@zoompoint.in',  // Sender's email
            user.email,              // User's email
            'Verify Your Email Address',  // Subject
            `<p>Please click the link below to verify your email address:</p><a href="${verificationUrl}">Verify Email</a>`
        );

        res.status(200).json({ msg: 'Registration successful. Please check your email for verification.' });

    } catch (err) {
        console.error('Register Error:', err.message);
        res.status(500).send('Server error');
    }
};


// Verify Email
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        // Find user by verification token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.verificationToken = null; // Clear the token
        await user.save();

        res.status(200).json({ msg: 'Email verified successfully. You can now log in.' });

    } catch (err) {
        console.error('Email Verification Error:', err.message);
        res.status(500).send('Server error');
    }
};

// User Login
exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Please verify your email to log in.' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                isAdmin: user.isAdmin, // Include isAdmin in payload if needed
            },
        };

        // Sign and send JWT token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('Error signing JWT:', err);
                throw err;
            }
            res.json({ 
                token, 
                user: { 
                    id: user.id, 
                    name: user.name, // Add other user details as needed
                    email: user.email, 
                    isAdmin: user.isAdmin 
                } 
            });
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server error');
    }
};


// Login with google 
exports.googleLogin = async (req, res) => {
    try {
        const payload = req.user; // The user is attached by the Google token middleware

        // Check if the user already exists in the database
        let user = await User.findOne({ email: payload.email });

        // If the user does not exist, create a new user and store in the database
        if (!user) {
            user = new User({
                name: payload.name,
                email: payload.email,
                avatar: payload.picture, // Assuming the picture URL is available in the payload
                isVerified: true, // Google users are considered verified since they logged in via Google
            });

            await user.save(); // Save the new user to the database
        }

        // Create a JWT token for the Google authenticated user
        const jwtPayload = { user: { id: user.id } };

        jwt.sign(
            jwtPayload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) {
                    throw err;
                }
                // Respond with the JWT token and user info
                res.json({ token, user });
            }
        );
    } catch (err) {
        console.error('Google Login Error:', err);
        res.status(500).json({ msg: 'Server error' });
    }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
    try {
        // Debug: Check if req.user is populated
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'User not authenticated' });
        }

        console.log('Fetching user with ID:', req.user.id); // Debugging log
        
        // Fetch user by ID, excluding the password field
        const user = await User.findById(req.user.id).select('-password');
        
        // Check if the user is found
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user data (excluding the password)
        res.json(user);
    } catch (error) {
        console.error('Error in getUserProfile:', error.message); // Log the exact error message
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
    const { name, email, mobile, address } = req.body; // Destructure the fields

    // Create an object to hold fields to be updated
    const updateFields = { name, email };

    // Add mobile and address to the update only if they are provided
    if (mobile !== undefined) {
        updateFields.mobile = mobile;
    }
    if (address !== undefined) {
        updateFields.address = address;
    }

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields }, // Use $set to update only the provided fields
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from the response

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
