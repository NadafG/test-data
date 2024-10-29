const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
require('dotenv').config();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const authMiddleware = async (req, res, next) => {
    // Extract JWT token from Authorization header (Bearer Token)
    const authHeader = req.headers['authorization'];
    const jwtToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // Extract Google token from request body
    const googleToken = req.body.token; // Assuming Google token is sent in the request body
    console.log(jwtToken);
    // If both tokens are missing, deny access
    if (!jwtToken) {
        return res.status(401).json({ msg: 'No token provided, authorization denied' });
    }

    // If JWT token is present, try to verify it
    if (jwtToken) {
        try {
            const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
            req.user = decoded.user; // Attach the decoded user object to the request
            return next(); // Proceed to the next middleware or route handler
        } catch (err) {
            return res.status(401).json({ msg: 'Invalid JWT token, authorization denied.' });
        }
    }

    // If Google token is present and JWT verification has not occurred, verify Google token
    if (googleToken) {
        try {
            // Verify Google token
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
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
            return next(); // Proceed to the next middleware or route handler
        } catch (err) {
            console.error('Error verifying Google token:', err);
            return res.status(401).json({ msg: 'Invalid Google token, authorization denied.' });
        }
    }
};

module.exports = authMiddleware;
