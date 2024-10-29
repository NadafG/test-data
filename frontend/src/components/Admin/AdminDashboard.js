// src/components/Admin/AdminDashboard.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebarmenu'; // Ensure Sidebar is in the same directory

const AdminDashboard = () => {
    return (
        <div className="d-flex">
            <Sidebar /> {/* Sidebar on the left */}
            <div className="container my-1 flex-grow-1"> {/* Main content area */}
                <Outlet /> {/* Render the respective component based on the active tab */}
            </div>
        </div>
    );
};

export default AdminDashboard;

