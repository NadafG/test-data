import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaHome, FaBuilding, FaStore } from 'react-icons/fa'; // Import icons
// import './PropertyCard.css'; // Import the CSS file

const PropertyCard = ({ property }) => {
    const renderIcon = (propertyType) => {
        switch (propertyType) {
            case 'plot':
                return <FaHome className="icon" />;
            case 'flat':
                return <FaBuilding className="icon" />;
            case 'commercial':
                return <FaStore className="icon" />;
            default:
                return null;
        }
    };

    return (
        <Link to={`/properties/${property._id}`} className="text-decoration-none">
            <div className="property-card">
                <img
                    src={property.images[0]}
                    className="property-image"
                    alt={property.projectName}
                />
                <div className="property-details">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                            <span className="property-icon">{renderIcon(property.propertyType)}</span>
                            <p className="property-type ms-2">{property.propertyType}</p> {/* Added margin start */}
                        </div>
                        <h5 className="property-title">{property.title}</h5>
                    </div>
                    <p className="property-project">Project Name: <strong>{property.projectName}</strong></p>
                    <p className="property-price">Price: <strong>${property.price}</strong></p>
                    <p className="property-location">Location: <strong>{property.location}</strong></p>
                    <p className="property-description">
                        {property.description.length > 100
                            ? `${property.description.substring(0, 97)}...` // Truncate description
                            : property.description}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default PropertyCard;
