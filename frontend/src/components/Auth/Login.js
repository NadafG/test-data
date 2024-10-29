import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext); // Include auth from context
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const { email, password } = formData;

    useEffect(() => {
        // If the user is already logged in, redirect them to the home page
        if (auth.token) {
            toast.info("You're already logged in! Feel free to explore.");
            setTimeout(() => {
                navigate('/');
            }, 1000);
        }
    }, [auth.token, navigate]); // Add auth.token and navigate as dependencies

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            const { token, user } = res.data; // Destructure token and user from response
            setAuth({
                token: res.data.token,
                user: res.data.user,
                isAdmin: res.data.user.isAdmin // Set isAdmin here
            });
            toast.success('Login successful! Ready to explore?');
            setTimeout(() => {
                navigate(user.isAdmin ? '/admin/dashboard' : '/'); // Redirect based on isAdmin
            }, 2000);
        } catch (err) {
            toast.error(err.response.data.msg || 'Login failed');
        }
    };

    // Google login success handler
    const handleGoogleLoginSuccess = async (response) => {
        try {
            const res = await axios.post('/api/auth/google-login', { token: response.credential });
            const { token, user } = res.data; // Destructure token and user from response
            setAuth({ token, user }); // Set auth context with token and user data
            toast.success('Google login successful!');
            setTimeout(() => {
                navigate(user.isAdmin ? '/admin/dashboard' : '/'); // Redirect based on isAdmin
            }, 3000);
        } catch (err) {
            toast.error(err.response.data.msg || 'Google login failed', {
                position: "top-center",
                autoClose: 2000,
                style: { backgroundColor: '#f44336', color: '#FFFFFF' },
            });
        }
    };

    return (
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-body">
                                <h2 className="text-center mb-4">Login to Your Account</h2>
                                <form onSubmit={onSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={email}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={password}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Login</button>
                                </form>
                                <hr />
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={() => {
                                        toast.error('Google login failed', {
                                            position: "top-center",
                                            style: { backgroundColor: '#f44336', color: '#FFFFFF' },
                                        });
                                    }}
                                />
                                <p className="text-center mt-4">Don't have an account? <a href="/register">Register here</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </GoogleOAuthProvider>
    );
};

export default Login;
