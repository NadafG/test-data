// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InterestedProperties = () => {
    const [interestedProperties, setInterestedProperties] = useState([]); // Initialize as an empty array
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const token = localStorage.getItem('token'); // Adjust to your token retrieval

    const fetchInterestedProperties = async (page = 0) => {
        try {
            const response = await axios.get(`/api/admin/interested-properties?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("API Response:", response.data);

            if (response.data && Array.isArray(response.data)) {
                setInterestedProperties(response.data); // Set the response array to state
                // Optionally handle pagination
            } else {
                console.error("Unexpected response structure:", response.data);
                setInterestedProperties([]); // Reset to an empty array on unexpected structure
            }
        } catch (error) {
            console.error("Error fetching interested properties:", error);
            setInterestedProperties([]); // Handle error and reset to empty array
            toast.error("Error fetching interested properties.");
        }
    };

    useEffect(() => {
        fetchInterestedProperties(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage);
    };

    return (
        <div className="container my-1">
            <h1 className="text-center mb-4">Interested Properties List</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                        <th>Property Title</th>
                        <th>Property Type</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {interestedProperties.length > 0 ? (
                        interestedProperties.map((property) => (
                            <tr key={property._id}>
                                <td>
                                    <img src={property.image || '/placeholder-image.png'} alt={property.propertyTitle} style={{ width: '100px', height: 'auto' }} />
                                </td>
                                <td>{property.userName}</td>
                                <td>{property.email}</td>
                                <td>{property.mobileNumber}</td>
                                <td>
                                    <a href={`/properties/${property.propertyId}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                        {property.propertyTitle}
                                    </a>
                                </td>
                                <td>{property.propertyType}</td>
                                <td>{property.location}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">No interested properties found</td>
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

export default InterestedProperties;
