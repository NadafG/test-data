const Property = require('../models/Property');
const Interest = require('../models/Interest');
const mongoose = require('mongoose');

// Add Property
exports.addProperty = async (req, res) => {
    const userId = req.user.id;
    const { propertyType, type, listedBy, projectName, title, description, facing,location,price} = req.body;
    const propertyFields = {
        propertyType,
        type,
        listedBy,
        userId,
        projectName,
        title,
        description,
        facing,
        location,
        price,
        postedBy: req.user.id,
        images: req.files.map(file => file.path),
        _id: req.body._id || new mongoose.Types.ObjectId()
    };

    if (propertyType === 'plot') {
        const { plotArea, length, breadth } = req.body;
        propertyFields.plotArea = plotArea;
        propertyFields.length = length;
        propertyFields.breadth = breadth;

    } else if (propertyType === 'flat' ){
          const { bedroom, bathroom, furnishing, constructionStatus, superBuiltupArea, carpetArea, maintenance, totalFloors, floorNo, carParking } = req.body;
        Object.assign(propertyFields, { bedroom, bathroom, furnishing, constructionStatus, superBuiltupArea, carpetArea, maintenance, totalFloors, floorNo, carParking });

    } else if (propertyType === 'commercial') {
        const { furnishing, constructionStatus, superBuiltupArea, carpetArea, maintenance, totalFloors, floorNo, carParking } = req.body;
        Object.assign(propertyFields, { furnishing, constructionStatus, superBuiltupArea, carpetArea, maintenance, totalFloors, floorNo, carParking });
    }

    //console.log('SAVE DATA:' ,propertyFields);
    try {
        const property = new Property(propertyFields);
        await property.save();
        res.status(201).json(property);
    } catch (err) {
        console.error(err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(500).send('Server error');
    }
};

// Get All Properties with Search by type, location, userId, and pagination
exports.getAllProperties = async (req, res) => {
    const { search, type, location, userId, page = 1, limit = 10 } = req.query; // Add userId from query parameters
    let query = {};

    // Build the query based on available parameters
    if (search || type || location || userId) {
        query = {
            $and: [
                // Search by text in addTitle, projectName, and description
                search
                    ? {
                          $or: [
                              { addTitle: { $regex: search, $options: 'i' } },
                              { projectName: { $regex: search, $options: 'i' } },
                              { description: { $regex: search, $options: 'i' } },
                          ],
                      }
                    : {},
                // Filter by type (buy, rent, commercial, plots)
                type
                    ? {
                          type: { $regex: type, $options: 'i' }, // Regex to allow case-insensitive matching
                      }
                    : {},
                // Filter by location
                location
                    ? {
                          location: { $regex: location, $options: 'i' }, // Regex for case-insensitive location search
                      }
                    : {},
                // Filter by userId if provided
                userId
                    ? {
                          postedBy: userId, // Assuming 'postedBy' is the field referencing the user's ID
                      }
                    : {},
            ].filter((condition) => Object.keys(condition).length !== 0), // Filter out empty conditions
        };
    }

    try {
        // Calculate pagination values
        const currentPage = parseInt(page, 10) || 1; // Convert page to integer, default to 1
        const perPage = parseInt(limit, 10) || 10; // Convert limit to integer, default to 10
        const skip = (currentPage - 1) * perPage; // Skip the correct number of records

        // Query the database with pagination
        const properties = await Property.find(query)
            .populate('userId', 'name') // Populating related fields
            .skip(skip) // Skip the records for pagination
            .limit(perPage); // Limit the number of records per page

        // Get the total count for the query (for pagination purposes)
        const totalProperties = await Property.countDocuments(query);

        // Send back the paginated result along with metadata
        res.json({
            properties, // The properties for the current page
            currentPage, // Current page number
            totalPages: Math.ceil(totalProperties / perPage), // Total number of pages
            totalProperties, // Total number of properties
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};



// Get Latest Properties
exports.getLatestProperties = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const userId = req.query.userId; // Get userId from query parameters

        // Create the base query
        let query = {};

        // If userId is provided, filter properties by userId
        if (userId) {
            query.postedBy = userId; // Assuming 'postedBy' references the user's ID
        }

        const properties = await Property.find(query)
            .populate('userId', 'name') // Populate the username field from the User model
            .sort({ createdAt: -1 })
            .limit(limit);

        const formattedProperties = properties.map(property => {
            return {
                _id: property._id,
                projectName: property.projectName,
                propertyType: property.propertyType,
                facing: property.facing,
                images: property.images.map(image => `${req.protocol}://${req.get('host')}/${image.replace(/\\/g, '/')}`),
                createdAt: property.createdAt,
                description: property.description,
                listedBy: property.listedBy,
                plotArea: property.plotArea,
                breadth: property.breadth,
                // Include any additional fields you want here
                location: property.location,  // Example field
                price: property.price,          // Example field
                bedrooms: property.bedrooms,    // Example field
                bathrooms: property.bathrooms,  // Example field
                amenities: property.amenities,  // Example field
                username: property.postedBy ? property.postedBy.username : null, // Ensure to include the username
                // Add other relevant fields as needed
            };
        });

        res.json(formattedProperties);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching properties' });
    }
};


// Get Random Property
exports.getRandomProperty = async (req, res) => {
    try {
        const count = await Property.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const property = await Property.findOne().skip(randomIndex).populate('listedBy', 'name');

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        const limitedImages = property.images.slice(0, 5);
        res.json({
            ...property.toObject(),
            images: limitedImages,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get Single Property
exports.getSingleProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id).populate('userId', 'name email');
        console.log('Property:', JSON.stringify(property, null, 2)); // Log the property object

        if (!property) {
            return res.status(404).json({ msg: 'Property not available' });
        }
        res.json(property);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Property not found' });
        }
        res.status(500).send('Server error');
    }
};


// Update Property
exports.updateProperty = async (req, res) => {
    const { type, listedBy, projectName, addTitle, description, facing } = req.body;

    const propertyFields = {};
    if (type) propertyFields.type = type;
    if (listedBy) propertyFields.listedBy = listedBy;
    if (projectName) propertyFields.projectName = projectName;
    if (addTitle) propertyFields.addTitle = addTitle;
    if (description) propertyFields.description = description;
    if (facing) propertyFields.facing = facing;
    if (req.files.length > 0) propertyFields.images = req.files.map(file => file.path);

    try {
        let property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        if (property.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        property = await Property.findByIdAndUpdate(
            req.params.id,
            { $set: propertyFields },
            { new: true }
        );

        res.json(property);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete Property
exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ msg: 'Property not found' });
        }

        if (property.postedBy.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await property.remove();
        res.json({ msg: 'Property removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Property not found' });
        }
        res.status(500).send('Server error');
    }
};

// Send interest inquiry
exports.sendInterest = async (req, res) => {
    const { name, email, message, userId, propertyId } = req.body;

    try {
        // Find the existing inquiry by email or userId
        const existingInquiry = await Interest.findOne({
            $or: [
                { email: email }, // Check for existing email
                { userId: userId } // Check for existing userId
            ]
        });

        let updatedInquiry;

        if (existingInquiry) {
            // If an existing inquiry is found, update it
            updatedInquiry = await Interest.findOneAndUpdate(
                { _id: existingInquiry._id }, // Use the existing inquiry's ID
                { name, email, message }, // Update fields
                { new: true } // Return the updated document
            );

            return res.status(200).json({ msg: 'Contact inquiry updated successfully', inquiry: updatedInquiry });
        } else {
            // If no existing inquiry is found, create a new one
            updatedInquiry = new Interest({
                name,
                email,
                message,
                userId,
                propertyId
            });

            await updatedInquiry.save(); // Save the new inquiry

            return res.status(201).json({ msg: 'New contact inquiry created successfully', inquiry: updatedInquiry });
        }

    } catch (error) {
        console.error('Error saving contact inquiry:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};
