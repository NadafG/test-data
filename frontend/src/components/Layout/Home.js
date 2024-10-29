import React, { useEffect, useState } from 'react';
import Slider from './Slider';
import PropertyCard from './PropertyCard';
import Search from './Search';
import Testimonials from './Testimonials';
import PropertyCarousel from './PropertyCarousel';
import { FaUserSlash, FaListAlt, FaEye } from 'react-icons/fa';
import 'font-awesome/css/font-awesome.min.css';

const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
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

                if (Array.isArray(data)) {
                    setFeaturedProperties(data);
                } else {
                    throw new Error('Received unexpected data format.');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    if (loading) {
        return (
            <div className="loading-overlay text-center">
                <img src="loading-green-loading.gif" alt="Loading..." />
            </div>
        );
    }

    if (error) {
        return <div className="text-danger text-center">Error: {error}</div>;
    }

    return (
        <div>
            <div className="position-relative">
                <Slider />
                <div className="my-4 position-absolute top-50 start-50 translate-middle z-3 p-3">
                    <Search />
                </div>
            </div>
            <PropertyCarousel />
            <section className="why-zoompoint">
                <h2>Why Use ZOOMPOINT</h2>
                <div className="features d-flex justify-content-around">
                    {[
                        {
                            icon: <FaUserSlash size={50} />,
                            title: 'Avoid Brokers',
                            description: 'We directly connect you to verified owners to save brokerage.',
                        },
                        {
                            icon: <FaListAlt size={50} />,
                            title: 'Free Listing',
                            description: 'Easy listing process. Also using WhatsApp.',
                        },
                        {
                            icon: <FaEye size={50} />,
                            title: 'Shortlist without Visit',
                            description: 'Extensive Information makes it easy.',
                        },
                    ].map((feature, index) => (
                        <div className="feature text-center" key={index}>
                            <div className="icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>
            <div className="container my-5">
                <h2 className="text-center mb-4">Featured Properties</h2>
                <div className="row">
                    {featuredProperties.length > 0 ? (
                        featuredProperties.map((property) => (
                            <div className="col-md-3 mb-4" key={property._id || property.projectName}>
                                <PropertyCard property={property} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">No properties available.</div>
                    )}
                </div>
            </div>
            <div className="container my-5">
                <h2 className="text-center mb-4">What Our Clients Say</h2>
                <Testimonials />
            </div>
        </div>
    );
};

export default Home;
