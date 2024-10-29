import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyInterestsList = () => {
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInterests = async () => {
            if (!auth.token) {
                toast.error('Please log in first to access this feature.');
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/api/dashboard/my-interests-list', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setInterests(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to fetch interests');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch interests');
            } finally {
                setLoading(false);
            }
        };

        fetchInterests();
    }, [auth.token, navigate]);

    const handleRemoveInterest = async (id) => {
        if (window.confirm('Are you sure you want to remove this interest?')) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`/api/dashboard/remove-interests/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setInterests((prevInterests) => prevInterests.filter((interest) => interest._id !== id));
                    toast.success('Interest removed successfully!');
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to remove interest');
                }
            } catch (error) {
                console.error('Error removing interest:', error);
                setError('An error occurred while removing the interest.');
            }
        }
    };

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">My Interests List</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Property Title</th>
                            <th>Property Type</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {interests.length > 0 ? (
                            interests.map(interest => (
                                <tr key={interest._id}>
                                    <td>
                                        {interest.propertyId ? (
                                            <Link to={`/properties/${interest.propertyId._id}`} className="text-decoration-none">
                                                {interest.propertyId.title}
                                            </Link>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td>{interest.propertyId ? interest.propertyId.propertyType : 'N/A'}</td>
                                    <td>{interest.propertyId ? interest.propertyId.location : 'N/A'}</td>
                                    <td>${interest.propertyId ? interest.propertyId.price.toLocaleString() : 'N/A'}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => handleRemoveInterest(interest._id)}>
                                            Remove from Interests
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No interests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MyInterestsList;
