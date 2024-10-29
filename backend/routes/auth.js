const express = require('express');
const { check } = require('express-validator');
const auth = require('../middleware/auth'); // Ensure this middleware is imported
const { getUserProfile, updateUserProfile,register, login, googleLogin } = require('../controllers/authController'); // Import googleLogin
const verifyGoogleToken = require('../middleware/googleAuth'); // Import the Google Auth middleware
const router = express.Router();
require('dotenv').config();
// Register Route with Validation
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
    ],
    register
);

// Login Route with Validation
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    login
);

// Route for Google login
router.post('/google', verifyGoogleToken, googleLogin); // Use the correct middleware and controller

router.route('/profile').get(auth,getUserProfile).put(auth,updateUserProfile); // Protecting the routes
module.exports = router;
