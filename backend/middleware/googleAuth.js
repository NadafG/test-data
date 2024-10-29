const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User'); // Assuming a User model exists
require('dotenv').config();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Middleware to verify Google token and create/verify user
const verifyGoogleToken = async (req, res, next) => {
    const token = req.body.token; // Get the token from the request body

    if (!token) {
        return res.status(400).json({ msg: 'No token provided' });
    }

    try {
        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Check if the user already exists in your database
        let user = await User.findOne({ email: payload.email });
        if (!user) {
            // If user doesn't exist, create a new one
            user = new User({
                name: payload.name,
                email: payload.email,
                avatar: payload.picture,
                isVerified: true, // Assuming Google users are always verified
            });

            await user.save();
        }

        // Attach user to request object
        req.user = user;
        next(); // Continue to the next middleware or route handler
    } catch (err) {
        console.error('Error verifying Google token:', err);
        return res.status(401).json({ msg: 'Invalid token' });
    }
};

module.exports = verifyGoogleToken;
