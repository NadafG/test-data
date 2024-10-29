// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaSlidersH, FaUsers, FaHome, FaHeart, FaEnvelope } from 'react-icons/fa'; // Import icons

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 className="text-center">Admin</h2>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <NavLink to="/admin/dashboard/slider" className="nav-link">
                        <FaSlidersH className="me-2" /> Slider
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/dashboard/user-list" className="nav-link">
                        <FaUsers className="me-2" /> User List
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/dashboard/property-list" className="nav-link">
                        <FaHome className="me-2" /> Property List
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/dashboard/interest-property" className="nav-link">
                        <FaHeart className="me-2" /> Interested Properties
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/admin/dashboard/contact-us" className="nav-link">
                        <FaEnvelope className="me-2" /> Contact Us List
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
