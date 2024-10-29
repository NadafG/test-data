import React, { useState, useEffect } from 'react';
import { Carousel, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faMapMarkerAlt, faDollarSign, faUser, faHome, faListAlt } from '@fortawesome/free-solid-svg-icons';

const PropertyCarousel = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await fetch('api/properties/latest');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (response.status === 200 && Array.isArray(data)) {
                    setProperties(data);
                } else {
                    setError('Received unexpected data format.');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const propertyChunks = chunkArray(properties, 4);

    if (loading) {
        return (
            <div className="text-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <div className="container my-5 product-slider">
            <h2 className="text-center mb-4">Newly Launched Projects</h2>
            <Carousel
                indicators={false}
                nextIcon={null} // Removed next icon
                prevIcon={null} // Removed previous icon
                wrap={true} // Enables infinite looping
            >
                {propertyChunks.map((chunk, index) => (
                    <Carousel.Item key={index}>
                        <Row className="g-4">
                            {chunk.map((property) => (
                                <Col key={property._id || property.projectName} lg={3} md={4} sm={6} xs={12} className="d-flex justify-content-center">
                                    <Link to={`/properties/${property._id}`} className="text-decoration-none">
                                        <Card className="border-0 product-card shadow-sm">
                                            <Card.Img
                                                src={property.images[0]}
                                                alt={property.projectName}
                                                className="property-image"
                                            />
                                            <Card.Body className="text-start p-3">
                                                <div className="badge new-launch mb-2">NEW LAUNCH</div>
                                                <Card.Title className="h5">{property.projectName}</Card.Title>
                                                <div className="property-details">
                                                    <div className="location text-muted">
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {property.location}
                                                    </div>
                                                    <div className="price text-primary fw-bold">
                                                        <FontAwesomeIcon icon={faDollarSign} /> {property.price}
                                                    </div>
                                                    <div className="config">
                                                        <FontAwesomeIcon icon={faUser} /> {property.postedBy}
                                                    </div>
                                                    <div className="possession text-success">
                                                        <FontAwesomeIcon icon={faHome} /> {property.propertyType}
                                                    </div>
                                                    <div className="offer-text text-secondary">
                                                        <FontAwesomeIcon icon={faListAlt} /> {property.facing}
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Link>
                                </Col>
                            ))}
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
};

// Helper function to split properties into chunks
const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};

export default PropertyCarousel;
