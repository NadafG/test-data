import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Ensure toast is imported
import 'react-toastify/dist/ReactToastify.css'; // Import CSS

const Register = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext); // Include auth from context
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const { name, email, password } = formData;

    // Check if the user is already logged in
    useEffect(() => {
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
            const res = await axios.post('/api/auth/register', formData);
            setAuth({ token: res.data.token, user: null });

            toast.success('Thank you for joining us! Your registration was successful.');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            if (err.response && err.response.status === 400) {
                // Check for validation errors
                const validationErrors = err.response.data.errors;

                if (validationErrors && validationErrors.length > 0) {
                    validationErrors.forEach(error => {
                        toast.error(error.msg, {
                            position: "top-center",
                            autoClose: 2000,
                            style: {
                                backgroundColor: '#f44336',
                                color: '#FFFFFF',
                            },
                        });
                    });
                } else {
                    toast.error(err.response.data.msg || 'Registration failed');
                }
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Create an Account</h2>
                            <form onSubmit={onSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={name}
                                        onChange={onChange}
                                        required
                                    />
                                </div>
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
                                <button type="submit" className="btn btn-primary w-100">Register</button>
                            </form>
                            <hr />
                            <p className="text-center">Already have an account? <a href="/login">Login here</a></p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer /> {/* Ensure ToastContainer is included */}
        </div>
    );
};

export default Register;
