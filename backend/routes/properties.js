const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const propertyController = require('../controllers/propertyController');


// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter configuration for multer
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb('Error: File type not supported');
        }
    }
});

const router = express.Router();

router.post('/save', auth, upload.array('images', 5), async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).send('No files uploaded');
        }

        // Path to the logo to be added as a watermark
        const logoPath = path.join(__dirname, '../public', 'logo', 'logo.png');

        // Process each uploaded image and apply the watermark
        const watermarkPromises = req.files.map(async (file) => {
            const imagePath = path.join(__dirname, '../uploads', file.filename);
            const watermarkedImagePath = path.join('uploads', 'zoompoint' + file.filename);

            // Apply watermark using sharp
            await sharp(imagePath)
                .composite([{
                    input: logoPath,
                    gravity: 'southeast',  // Place logo at bottom-right
                    blend: 'over'
                }])
                .toFile(watermarkedImagePath);

            // Optionally, remove the original image if you only want the watermarked version
            //fs.unlinkSync(imagePath);

            // Update the file object to point to the watermarked image
            file.path = watermarkedImagePath;
        });

        // Wait for all watermarking operations to complete
        await Promise.all(watermarkPromises);

        // Call the property controller logic after watermarking
        propertyController.addProperty(req, res);
    } catch (error) {
        console.error('Error processing images:', error);
        res.status(500).send('Error processing images');
    }
});


// Property routes
//router.post('/save', auth, upload.array('images', 5), propertyController.addProperty);
router.get('/search', propertyController.getAllProperties);
router.get('/latest', propertyController.getLatestProperties);
router.get('/random', propertyController.getRandomProperty);
router.get('/:id', propertyController.getSingleProperty);
router.put('/:id', auth, upload.array('images', 5), propertyController.updateProperty);
router.delete('/:id', auth, propertyController.deleteProperty);
// Route to handle updating interest inquiries
router.post('/interest', propertyController.sendInterest); // Assuming you want to update an inquiry
module.exports = router;
