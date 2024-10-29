import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchForm from '../Layout/Search';


const PropertyList = () => {
    const location = useLocation();
    const [properties, setProperties] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [propertiesPerPage] = useState(6);
    const [sortOption, setSortOption] = useState('latest');
    const [viewMode, setViewMode] = useState('grid');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate(); // Initialize useNavigate

    const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/properties/search');
            if (Array.isArray(response.data)) {
                setProperties(response.data);
            } else {
                setProperties(response.data.properties || []);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
            setError('Failed to fetch properties. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleViewDetails = (propertyId) => {
        // Navigate to the details page with the property ID in the URL
        navigate(`/properties/${propertyId}`);
    };

    const indexOfLastProperty = currentPage * propertiesPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
    const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container property-list">

            <SearchForm />


            {loading ? (
                <p className="text-center">Loading properties...</p>
            ) : error ? (
                <p className="text-center text-danger">{error}</p>
            ) : properties.length === 0 ? (
                <p className="text-center">No properties found.</p>
            ) : (
                <div className="row">
                    <div className={`col-md-12`}>
                        <div className={viewMode === 'grid' ? 'row' : 'list-view'}>
                            {currentProperties.map((property) => (
                                <div className={`col-md-${viewMode === 'list' ? '12' : '4'} mb-4`} key={property.id}>
                                    <div className={`card property-card ${viewMode}`}>
                                        <img
                                            src={property.images[0] || 'default-property.jpg'}
                                            className="card-img-top"
                                            alt={property.name}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{property.name}</h5>
                                            <p className="card-text">Location: {property.location}</p>
                                            <p className="card-text">Price: ${property.price}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleViewDetails(property._id)} // Navigate on click
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    {[...Array(Math.ceil(properties.length / propertiesPerPage)).keys()].map((page) => (
                        <li key={page + 1} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                            <button onClick={() => paginate(page + 1)} className="page-link">
                                {page + 1}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default PropertyList;
