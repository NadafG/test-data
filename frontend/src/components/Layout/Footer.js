// src/components/Layout/Footer.js
import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-4">
            <div className="container">
                <div className="row mb-4">
                    <div className="col-md-4">
                        <h5>About Us</h5>
                        <p>Your Trusted Partner in Finding Your Dream Property in Pune, Maharashtra
                            Finding the right property is a significant milestone for anyone. Whether you are a first-time homebuyer, an investor, or someone looking to relocate, the process can often feel overwhelming. At [Your Company Name], we understand that your home is more than just a place to live; it’s where memories are made and dreams take shape. That’s why we are dedicated to being your trusted partner in navigating the vibrant real estate market of Pune, Maharashtra.</p>
                    </div>
                    <div className="col-md-4">
                        <h5>Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/" className="text-white">Home</a></li>
                            <li><a href="/about" className="text-white">About Us</a></li>
                            <li><a href="/properties" className="text-white">Properties</a></li>
                            <li><a href="/contact" className="text-white">Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5>Contact Us</h5>
                        <p>Email: info@zoom-point.com</p>
                        <p>Phone: +1 (234) 567-890</p>
                    </div>
                </div>
                <div className="social-icons mb-3">
                    <a href="#" className="text-white me-3"><FaFacebookF /></a>
                    <a href="#" className="text-white me-3"><FaTwitter /></a>
                    <a href="#" className="text-white me-3"><FaInstagram /></a>
                    <a href="#" className="text-white"><FaLinkedin /></a>
                </div>
                <p>&copy; 2024 Zoom-Point Platform. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
