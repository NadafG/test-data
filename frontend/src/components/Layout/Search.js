import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTab, setSelectedTab] = useState('Buy'); // Default tab set to 'Buy'

    const navigate = useNavigate();

    // Handle tab change
    const handleTabChange = (tab) => {
        setSelectedTab(tab); // Set the selected tab
    };

    // Handle search input
    const handleSearch = async () => {
        try {
            console.log(searchTerm);
            const response = await fetch(`/api/properties/search?q=${searchTerm}`);
            const data = await response.json();
            navigate('/property-list', { state: { properties: data } });
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (

        <div className="search-card stylish-card p-4">
            {/* Tab buttons */}
            <div className="search-options mb-3 d-flex justify-content-center">
                {['Buy', 'Rent', 'Commercial', 'Plot'].map((tab) => (
                    <button
                        key={tab}
                        className={`option btn ${selectedTab === tab ? 'active-tab btn-primary' : 'btn-light'}`} // Toggle class based on selection
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Search bar */}
            <div className="search-bar input-group stylish-input">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="btn btn-primary search-button"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
        </div>

    );
};

export default Search;
