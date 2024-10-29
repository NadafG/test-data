import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
//import './Slider.css'; // Import CSS for additional styling

const Slider = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // Fetch the latest 5 properties from the API
                const res = await axios.get('/api/properties/latest?limit=5');
                console.log(res.data); // Log the response data
                setProperties(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProperties();
    }, []);

    return (
        <Carousel fade interval={5000} controls={false} indicators={true}>
            {properties.length > 0 ? (
                properties.map(property => (
                    <Carousel.Item key={property._id}>
                        {property.images.length > 0 && (
                            <img
                                className="d-block w-100"
                                src={property.images[0]} // Use the full URL from the API response
                                alt={property.projectName || "Property Image"} // Use projectName for the title
                                style={{ height: '400px', objectFit: 'cover', border: 'none' }} // Decreased height and no border
                            />
                        )}
                    </Carousel.Item>
                ))
            ) : (
                <Carousel.Item>
                    <div className="d-block w-100" style={{ height: '400px', backgroundColor: '#f0f0f0' }}>
                        <h3 className="text-center text-dark" style={{ paddingTop: '150px' }}>No Properties Available</h3>
                    </div>
                </Carousel.Item>
            )}
        </Carousel>
    );
};

export default Slider;
