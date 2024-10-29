const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Ensure this middleware is imported
const dashboardController = require('../controllers/dashboardController'); // Adjust the path as necessary

// Define routes
router.get('/my-properties-list', auth, dashboardController.getMyPropertyList);
router.delete('/remove-properties/:id', auth, dashboardController.deleteProperty);
router.post('/updateProperty', auth, dashboardController.updateProperty); // Ensure addProperty is defined
// Define the route for fetching user interests
router.get('/my-interests-list', auth, dashboardController.myInterestsList);
// Remove a specific interest from the user's interests list
router.delete('/remove-interests/:id', auth, dashboardController.removeInterest);  // Note the corrected function name: removeInterest
module.exports = router;
