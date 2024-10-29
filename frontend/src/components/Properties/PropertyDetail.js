import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faDollarSign, faUser, faHome, faBed, faBath, faCar, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';

const PropertyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [property, setProperty] = useState(null);
    const [nearbyProperties, setNearbyProperties] = useState([]);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`/api/properties/${id}`);
                setProperty(res.data);
                fetchNearbyProperties(res.data.location);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProperty();
    }, [id]);

    const fetchNearbyProperties = async (location) => {
        try {
            const res = await axios.get(`/api/properties?location=${location}`);
            setNearbyProperties(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission
        const userId = auth.user && auth.user.id ? auth.user.id : null; // Ensure you're getting the ID correctly
        const formData = {
            name: contactForm.name,
            email: contactForm.email,
            message: contactForm.message,
            userId: userId,
            propertyId: id // The ID of the property being inquired about
        };

        try {
            const response = await fetch('/api/properties/interest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Your message has been sent to the property owner!');
                setContactForm({ name: '', email: '', message: '' }); // Reset form
                setShowModal(false); // Hide modal on successful submission
            } else {
                throw new Error('Failed to send message.');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('There was a problem submitting your message.');
        }
    };
    if (!property) return <p>Loading...</p>;

    return (
        <div className="container my-5">
            <h1 className="property-title text-center mb-4">{property.projectName}</h1>
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="gallery">
                        {property.images.length > 0 ? (
                            <img
                                src={`/${property.images[0]}`}
                                alt={property.projectName}
                                className="img-fluid main-image rounded shadow"
                            />
                        ) : (
                            <img
                                src="/default-property.jpg"
                                alt="No image available"
                                className="img-fluid main-image rounded shadow"
                            />
                        )}
                        <div className="thumbnails mt-2">
                            {property.images.map((img, index) => (
                                <img
                                    key={index}
                                    src={`/${img}`}
                                    alt={`${property.title} ${index + 1}`}
                                    className="thumbnail rounded shadow"
                                    onClick={() => document.querySelector('.main-image').src = `/${img}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="details-table rounded shadow">
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="component__tableHead">
                                            <FontAwesomeIcon icon={faMapMarkerAlt} /> Location
                                        </div>
                                        <div className="component__details">{property.location}</div>
                                    </td>
                                    <td>
                                        <div className="component__tableHead">
                                            <FontAwesomeIcon icon={faDollarSign} /> Price
                                        </div>
                                        <div className="component__details">${property.price}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="component__tableHead">
                                            <FontAwesomeIcon icon={faUser} /> Posted By
                                        </div>
                                        <div className="component__details">{property.userId.name}</div>
                                    </td>
                                    <td>
                                        <div className="component__tableHead">
                                            <FontAwesomeIcon icon={faHome} /> Property Type
                                        </div>
                                        <div className="component__details">{property.propertyType}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="component__tableHead">
                                            <FontAwesomeIcon icon={faClipboardList} /> Facing
                                        </div>
                                        <div className="component__details">{property.facing}</div>
                                    </td>
                                    <td>
                                        <div className="component__tableHead">
                                            <FontAwesomeIcon icon={faClipboardList} /> Furnishing
                                        </div>
                                        <div className="component__details">{property.furnishing}</div>
                                    </td>
                                </tr>
                                {(property.propertyType === 'flat' || property.propertyType === 'commercial') && (
                                    <>
                                        <tr>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faBed} /> Bedroom
                                                </div>
                                                <div className="component__details">{property.bedroom}</div>
                                            </td>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faBath} /> Bathroom
                                                </div>
                                                <div className="component__details">{property.bathroom}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faClipboardList} /> Super Built-up Area
                                                </div>
                                                <div className="component__details">{property.superBuiltupArea} sq ft</div>
                                            </td>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faClipboardList} /> Carpet Area
                                                </div>
                                                <div className="component__details">{property.carpetArea} sq ft</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faClipboardList} /> Total Floors
                                                </div>
                                                <div className="component__details">{property.totalFloors}</div>
                                            </td>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faClipboardList} /> Floor No
                                                </div>
                                                <div className="component__details">{property.floorNo}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faCar} /> Car Parking
                                                </div>
                                                <div className="component__details">{property.carParking}</div>
                                            </td>
                                            <td>
                                                <div className="component__tableHead">
                                                    <FontAwesomeIcon icon={faClipboardList} /> Construction Status
                                                </div>
                                                <div className="component__details">{property.constructionStatus}</div>
                                            </td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-center mt-3 p-3">
                            <button
                                className="btn btn-primary rounded shadow p-1" // Added p-3 for padding
                                onClick={() => setShowModal(true)} // Show modal on button click
                            >
                                Contact Property Owner
                            </button>
                        </div>

                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="description-card p-4 mb-4 shadow rounded">
                        <h2 className="description-title">Property Description</h2>
                        <p className="description-text">{property.description}</p>
                    </div>
                </div>
            </div>

            {/* Contact Property Owner Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Contact Property Owner</h5>
                                <button type="button" className="btn-close btn-close-black" onClick={() => setShowModal(false)} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleContactSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="form-control"
                                            value={contactForm.name}
                                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="form-control"
                                            value={contactForm.email}
                                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea
                                            id="message"
                                            className="form-control"
                                            rows="4"
                                            value={contactForm.message}
                                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Nearby Properties */}
            <div className="nearby-properties mt-5">
                <h2>Nearby Properties</h2>
                <div className="row">
                    {nearbyProperties.map((nearbyProperty) => (
                        <div key={nearbyProperty.id} className="col-md-4 mb-4">
                            <div className="card">
                                <img src={`/${nearbyProperty.images[0]}`} alt={nearbyProperty.title} className="card-img-top" />
                                <div className="card-body">
                                    <h5 className="card-title">{nearbyProperty.title}</h5>
                                    <p className="card-text">{nearbyProperty.location}</p>
                                    <button className="btn btn-primary" onClick={() => navigate(`/properties/${nearbyProperty.id}`)}>View Details</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
