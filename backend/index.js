// index.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const propertiesRouter = require('./routes/properties');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Verify critical environment variables are set
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'PORT'];
requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        console.error(`Error: ${varName} is not defined in the environment variables.`);
        process.exit(1);
    }
});


// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev')); // For logging HTTP requests
app.use(cors()); // Enable CORS if needed

// Connect to MongoDB
connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/auth', authRoutes);

app.use('/api/properties', propertiesRouter);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/admin', adminRoutes);
// Define PORT
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
