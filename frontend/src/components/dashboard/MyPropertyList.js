import React, { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthContext } from '../../context/AuthContext';

const MyPropertyList = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Number of items per page
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProperties = async () => {
            if (!auth.token) {
                toast.error('Please log in first to access this feature.');
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/api/dashboard/my-properties-list', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProperties(data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [auth.token, navigate]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`/api/dashboard/remove-properties/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    toast.success('Property deleted successfully!');
                    setProperties(properties.filter(property => property._id !== id));
                } else {
                    const errorData = await response.json();
                    setError(errorData.message);
                    toast.error('Failed to delete property.');
                }
            } catch (error) {
                console.error('Error deleting property:', error);
                toast.error('An error occurred while deleting the property.');
            }
        }
    };

    const handleUpdate = (id) => {
        // Display a coming soon alert
        const alertMessage = 'Coming Soon! Update functionality is not yet implemented.';
        toast.info(alertMessage);
        // Optional: you can also set a state for showing an alert on the UI
        // setAlertMessage(alertMessage); // Uncomment if you want to show it in the UI
    };

    // Calculate current properties
    const indexOfLastProperty = currentPage * itemsPerPage;
    const indexOfFirstProperty = indexOfLastProperty - itemsPerPage;
    const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <p className="text-center">Loading...</p>;

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">My Property List</h1>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Property Type</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProperties.length > 0 ? (
                            currentProperties.map(property => (
                                <tr key={property.id}>
                                    <td>
                                        <a
                                            href={`/properties/${property._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <img
                                                src={property.images[0]}
                                                alt={property.title}
                                                style={{ width: '100px', height: 'auto', borderRadius: '8px' }}
                                            />
                                        </a>
                                    </td>
                                    <td>
                                        <a href={`/properties/${property._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {property.title}
                                        </a>
                                    </td>
                                    <td>

                                        {property.propertyType}

                                    </td>
                                    <td>

                                        {property.location}

                                    </td>
                                    <td>

                                        ${property.price.toLocaleString()}

                                    </td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => handleUpdate(property._id)}>
                                            Update
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(property._id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No properties found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={properties.length}
                paginate={paginate}
                currentPage={currentPage}
            />
        </div>
    );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <a onClick={() => paginate(number)} href="#!" className="page-link">
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default MyPropertyList;
