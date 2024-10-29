import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Auth Pages
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

// Layout Pages
import Navbar from './components/Layout/Navbar';
import Home from './components/Layout/Home';
import Footer from './components/Layout/Footer';

// Properties
import PropertyDetail from './components/Properties/PropertyDetail';
import PropertyList from './components/Properties/PropertyList';

// Other Pages
import Contact from './components/pages/Contact';
import AboutUs from './components/pages/AboutUs';

// Dashboard Pages
import AddProperty from './components/dashboard/AddProperty';
import MyProfile from './components/dashboard/MyProfile';
import MyPropertyList from './components/dashboard/MyPropertyList';
import MyInterestsList from './components/dashboard/MyInterestsList';

// Admin Dashboard
import AdminDashboard from './components/Admin/AdminDashboard';
import Slider from './components/Admin/Slider';
import UserList from './components/Admin/UserList';
import AdminPropertyList from './components/Admin/PropertyList'; // Renamed to avoid confusion
import InterestedProperties from './components/Admin/InterestedProperties';
import ContactUsList from './components/Admin/ContactUsList';

// Toast Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toast CSS

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Includes Popper.js

// Styles
import './styles.css'; // Adjust the path as necessary

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <ToastContainer /> {/* Ensure ToastContainer is included */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/property-list" element={<PropertyList />} />

          {/* Protected Routes */}
          <Route path="/add-property" element={<ProtectedRoute element={<AddProperty />} />} />
          <Route path="/my-profile" element={<ProtectedRoute element={<MyProfile />} />} />
          <Route path="/my-property-list" element={<ProtectedRoute element={<MyPropertyList />} />} />
          <Route path="/my-interests-list" element={<ProtectedRoute element={<MyInterestsList />} />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />}>
            <Route path="slider" element={<Slider />} />
            <Route path="user-list" element={<UserList />} />
            <Route path="property-list" element={<AdminPropertyList />} /> {/* Renamed to avoid confusion */}
            <Route path="interest-property" element={<InterestedProperties />} />
            <Route path="contact-us" element={<ContactUsList />} />
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
