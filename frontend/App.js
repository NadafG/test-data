import React, { useEffect } from 'react'; // Import useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Slider from './components/Layout/Slider';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import AddProperty from './components/Properties/AddProperty';
import PropertyList from './components/Properties/PropertyList';
import PropertyDetail from './components/Properties/PropertyDetail';
import Toastify from 'react-toastify';
const { ToastContainer } = Toastify;
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    useEffect(() => {
        document.title = 'ZoomPoint.in'; // Set document title
    }, []); // Empty dependency array ensures this runs once when the component mounts

    return (
        <Router>
            <Navbar />
            <Slider />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<PropertyList />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                </Routes>
            </div>
            <ToastContainer />
        </Router>
    );
}

export default App;
