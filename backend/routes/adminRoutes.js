// routes/propertyRoutes.js
const express = require('express');
const auth = require('../middleware/auth'); // Ensure this is the correct path for your auth middleware
const router = express.Router();
const adminController = require('../controllers/adminController'); // Adjust the path as necessary

// Route to get all properties with authentication
router.get('/properties', auth, adminController.getAllPropertyList);
router.put('/properties/approve/:id', auth, adminController.approveProperty);
router.delete('/properties/:id', auth, adminController.deleteProperty);

//users
router.get('/users', auth, adminController.getAllUsersList);
router.put('/users/approve/:id', auth, adminController.approveUser);
router.delete('/usersremove/:id', auth, adminController.deleteUser);

module.exports = router;
