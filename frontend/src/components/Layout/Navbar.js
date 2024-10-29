import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify'; // Ensure toast is imported
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { FaUserCircle } from 'react-icons/fa'; // Example icon

const Navbar = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate(); // Use useNavigate for programmatic navigation

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const logout = () => {
        setAuth({ token: null, user: null, isAdmin: false }); // Reset isAdmin on logout
        localStorage.removeItem('token');
        toast.success('Logged out! Looking forward to your next visit.');
        setDropdownOpen(false); // Close dropdown on logout
        navigate('/login'); // Redirect to login after logout
    };

    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState); // Toggle dropdown state safely
    };

    useEffect(() => {
        // Check if the token is present in local storage
        const token = localStorage.getItem('token');
        if (!token) {
            logout(); // Call logout to clear auth data and redirect
        }
    }, []); // Empty dependency array to run once on mount

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container-fluid">
                <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
                    <img src="/zoompoint-logo.png" alt="ZoomPoint Logo" style={{ height: '26px', marginRight: '10px' }} />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link btn free-post-button" to="/add-property" activeClassName="active">Free Post Property</NavLink>
                        </li>
                        {/* Show additional admin link if user is an admin */}
                        {auth.isAdmin && (
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/admin/dashboard" activeClassName="active">Dashboard</NavLink>
                            </li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-3">
                        {auth.token ? (
                            <li className="nav-item dropdown">
                                <button className="btn btn-link" onClick={toggleDropdown}>
                                    <FaUserCircle size={30} />
                                </button>
                                {dropdownOpen && (
                                    <div className="dropdown-menu show">
                                        <NavLink className="dropdown-item" to="/my-profile">Profile</NavLink>
                                        <NavLink className="dropdown-item" to="/my-property-list">My Properties</NavLink>
                                        <NavLink className="dropdown-item" to="/my-interests-list">My Interests</NavLink>
                                        <button className="dropdown-item" onClick={logout}>Logout</button>
                                    </div>
                                )}
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/register" activeClassName="active">Sign up</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link" to="/login" activeClassName="active">Login</NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            <ToastContainer /> {/* Ensure the ToastContainer is included */}
        </nav>
    );
};

export default Navbar;
