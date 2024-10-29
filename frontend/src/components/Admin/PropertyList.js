// src/components/Admin/PropertyList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PropertyList = () => {
    const [properties, setProperties] = useState([]); // Initialize as an empty array
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const token = localStorage.getItem('token'); // Adjust to your token retrieval

    const fetchProperties = async (page = 0) => {
        try {
            const response = await axios.get(`/api/admin/properties?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("API Response:", response.data);

            if (response.data && Array.isArray(response.data)) {
                setProperties(response.data); // Set the response array to state
                // Optionally handle pagination
            } else {
                console.error("Unexpected response structure:", response.data);
                setProperties([]); // Reset to an empty array on unexpected structure
            }
        } catch (error) {
            console.error("Error fetching properties:", error);
            setProperties([]); // Handle error and reset to empty array
            toast.error("Error fetching properties.");
        }
    };

    useEffect(() => {
        fetchProperties(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage);
    };

    const handleApprove = async (propertyId) => {
        try {
            const response = await axios.put(
                `/api/admin/properties/approve/${propertyId}`,
                {}, // If no body, pass an empty object
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,  // Use the passed token
                    }
                }
            );
            toast.success(response.data.message || "Property approved successfully!");
            setTimeout(() => {
                window.location.reload(); // Refresh page after successful approval
            }, 1000);
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error("Error fetching properties.");
        }
    };

    const handleDelete = async (propertyId) => {
        try {
            const response = await axios.delete(
                `/api/admin/properties/${propertyId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,  // Use the passed token
                    }
                }
            );
            //console.log(response.data.message);
            toast.success(response.data.message || "Property Deleted successfully!");
            setTimeout(() => {
                window.location.reload(); // Refresh page after successful approval
            }, 1000);
            // Optionally, update UI after deletion
        } catch (error) {
            console.error("Error fetching properties:", error);
            toast.error("Error fetching properties.");
        }
    };


    return (
        <div className="container my-1">
            <h1 className="text-center mb-4">Property List</h1>
            <table className="table table-bordered">
                <thead>
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
                    {properties.length > 0 ? (
                        properties.map((property) => (
                            <tr key={property._id}>
                                <td>
                                    <img src={property.images[0]} alt={property.title} style={{ width: '100px', height: 'auto' }} />
                                </td>
                                <td> <a href={`/properties/${property._id}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                    {property.title}
                                </a></td>
                                <td>{property.propertyType}</td>
                                <td>{property.location}</td>
                                <td>{property.price}</td>
                                <td>
                                    {!property.isApprove && (
                                        <button
                                            className="btn btn-success me-2"
                                            onClick={() => handleApprove(property._id)}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDelete(property._id)}
                                    >
                                        Delete
                                    </button>
                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No properties found</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ReactPaginate
                previousLabel={"< Previous"}
                nextLabel={"Next >"}
                breakLabel={"..."}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                activeClassName={"active"}
            />
            <ToastContainer />
        </div>
    );
};

export default PropertyList;
