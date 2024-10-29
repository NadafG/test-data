// src/pages/Admin/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserList = () => {
    const [users, setUsers] = useState([]); // Initialize as an empty array
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const token = localStorage.getItem('token'); // Adjust to your token retrieval

    const fetchUsers = async (page = 0) => {
        try {
            const response = await axios.get(`/api/admin/users?page=${page}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("API Response:", response.data);

            if (response.data && Array.isArray(response.data)) {
                setUsers(response.data); // Set the response array to state
                // Optionally handle pagination
            } else {
                console.error("Unexpected response structure:", response.data);
                setUsers([]); // Reset to an empty array on unexpected structure
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]); // Handle error and reset to empty array
            toast.error("Error fetching users.");
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        const selectedPage = data.selected;
        setCurrentPage(selectedPage);
    };

    const handleApprove = async (userId) => {
        try {
            const response = await axios.put(
                `/api/admin/users/approve/${userId}`,
                {}, // If no body, pass an empty object
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            toast.success(response.data.message || "User approved successfully!");
            setTimeout(() => {
                window.location.reload(); // Refresh page after successful approval
            }, 1000);
        } catch (error) {
            console.error("Error approving user:", error);
            toast.error("Error approving user.");
        }
    };

    const handleDelete = async (userId) => {
        try {
            const response = await axios.delete(
                `/api/admin/usersremove/${userId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            toast.success(response.data.message || "User deleted successfully!");
            setTimeout(() => {
                window.location.reload(); // Refresh page after successful deletion
            }, 1000);
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Error deleting user.");
        }
    };

    return (
        <div className="container my-1">
            <h1 className="text-center mb-4">User List</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.mobile}</td>
                                <td>{user.address}</td>
                                <td>
                                    {/* Only show the Approve button if the user is not verified */}
                                    {!user.isVerified && (
                                        <button
                                            className="btn btn-success me-2"
                                            onClick={() => handleApprove(user._id)}
                                        >
                                            Approve
                                        </button>
                                    )}
                                    {!user.isAdmin && (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Delete
                                        </button>
                                    )}

                                </td>

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No users found</td>
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

export default UserList;
