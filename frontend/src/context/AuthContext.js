import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        token: localStorage.getItem('token'),
        user: null,
        isAdmin: false, // Initialize isAdmin
    });

    useEffect(() => {
        if (auth.token) {
            setAuthToken(auth.token);
            try {
                const decoded = jwtDecode(auth.token);
                // Update the auth state with user info and isAdmin status
                setAuth(prev => ({
                    ...prev,
                    user: decoded.user,
                    isAdmin: decoded.user.isAdmin || false // Handle isAdmin from the token
                }));
            } catch (error) {
                console.error("Token decoding failed:", error);
                setAuth({ token: null, user: null, isAdmin: false }); // Reset state on error
            }
        } else {
            setAuth({ token: null, user: null, isAdmin: false }); // Reset state if no token
        }
    }, [auth.token]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
