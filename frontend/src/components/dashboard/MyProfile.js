import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        mobile: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!auth.token) {
                toast.error('Please log in first to access this feature.');
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/api/auth/profile', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch user profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [auth.token, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                toast.success('Profile updated successfully!');
            } else {
                const errorData = await response.json();
                setError(errorData.message);
                toast.error('Failed to update profile.');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('An error occurred while updating your profile.');
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">My Profile</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="card shadow">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="name" className="form-label">Name:</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="form-control"
                                    value={user.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="email" className="form-label">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    value={user.email}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="mobile" className="form-label">Mobile Number:</label>
                                <input
                                    type="text"
                                    id="mobile"
                                    name="mobile"
                                    className="form-control"
                                    value={user.mobile}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="address" className="form-label">Address:</label>
                                <textarea
                                    id="address"
                                    name="address"
                                    className="form-control"
                                    value={user.address}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Update Profile</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
