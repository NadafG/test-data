import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust the path as necessary
import { toast } from 'react-toastify'; // Import toast

const ProtectedRoute = ({ element }) => {
    const { auth } = useContext(AuthContext); // Assuming you have an auth state in context
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!auth?.token) {
            // Show a toast message if the user is not authenticated
            toast.info("Oops! It looks like you're not logged in. Please log in first!");
            // Set redirect to true after 2 seconds
            const timer = setTimeout(() => {
                setRedirect(true);
            }, 1000);

            return () => clearTimeout(timer); // Clear timer on unmount
        }
    }, [auth]);

    if (redirect) {
        return <Navigate to="/login" replace />;
    }

    return auth?.token ? element : null; // Return null while waiting to redirect
};

export default ProtectedRoute;
