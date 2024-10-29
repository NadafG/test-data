import React from 'react';

const AboutUs = () => {
    const sections = [
        {
            title: "Who We Are",
            icon: "fas fa-user-friends",
            image: "https://via.placeholder.com/400x300",
            content: "Welcome to <strong>zoompoint</strong>, your trusted partner in navigating the real estate market of Pune, Maharashtra. Established in [Year of Establishment], we are dedicated to helping individuals and families find their dream properties without the burden of broker charges. Our passion for real estate, combined with a deep understanding of the local market, allows us to provide exceptional service tailored to your unique needs."
        },
        {
            title: "Our Mission",
            icon: "fas fa-bullseye",
            image: "https://via.placeholder.com/400x300",
            content: "At <strong>zoompoint</strong>, our mission is to simplify the property search process for our clients. We believe that everyone deserves access to quality housing options without incurring excessive costs. By eliminating broker fees and offering a transparent, client-focused service, we strive to empower our clients to make informed decisions about their real estate investments."
        },
        {
            title: "Our Vision",
            icon: "fas fa-eye",
            image: "https://via.placeholder.com/400x300",
            content: "We envision a future where finding a home is a seamless and enjoyable experience for everyone. We aim to revolutionize the real estate landscape in Pune by fostering direct connections between property buyers and sellers, enabling transactions that are efficient, transparent, and fair. Our vision is to be the go-to platform for anyone looking to buy or invest in property in Pune."
        },
        {
            title: "Our Values",
            icon: "fas fa-handshake",
            image: "https://via.placeholder.com/400x300",
            content: (
                <ul>
                    <li><strong>Integrity:</strong> We uphold the highest standards of integrity in all our actions. Our clients can trust that we will provide honest advice and guidance throughout their property journey.</li>
                    <li><strong>Client-Centric Approach:</strong> Your satisfaction is our priority. We listen to your needs, understand your preferences, and tailor our services to meet your expectations.</li>
                    <li><strong>Transparency:</strong> We believe in clear communication and full transparency regarding our processes and fees. Our goal is to build long-lasting relationships based on trust.</li>
                    <li><strong>Excellence:</strong> We are committed to delivering excellence in everything we do. From property listings to customer service, we strive for the highest quality.</li>
                </ul>
            )
        },
        {
            title: "Our Team",
            icon: "fas fa-users",
            image: "https://via.placeholder.com/400x300",
            content: "Our dedicated team of real estate professionals is at the heart of what we do. With years of experience and in-depth knowledge of the Pune real estate market, our team is equipped to provide valuable insights and guidance. We are passionate about helping our clients find not just a house, but a place they can truly call home."
        },
        {
            title: "Why Choose Us?",
            icon: "fas fa-check-circle",
            image: "https://via.placeholder.com/400x300",
            content: (
                <ul>
                    <li><strong>No Broker Charges:</strong> We believe in making property accessible to everyone. Our model eliminates the need for broker fees, ensuring you get the best deal possible.</li>
                    <li><strong>Comprehensive Listings:</strong> Our extensive database includes a wide range of properties across Pune, from luxury apartments to budget-friendly homes. We continuously update our listings to provide you with the latest opportunities.</li>
                    <li><strong>Personalized Service:</strong> Every client is unique, and we take the time to understand your specific needs. Our personalized approach ensures that you receive the attention and care you deserve.</li>
                    <li><strong>Guidance at Every Step:</strong> From the initial property search to closing the deal, our team is here to guide you every step of the way. We handle all the details, so you can focus on what matters most.</li>
                </ul>
            )
        },
        {
            title: "Join Us on Your Property Journey",
            icon: "fas fa-envelope",
            image: "https://via.placeholder.com/400x300",
            content: "Whether you’re a first-time homebuyer, an experienced investor, or someone looking to sell, <strong>zoompoint</strong> is here to help you achieve your real estate goals. Contact us today to learn more about our services and how we can assist you in finding your dream property in Pune, Maharashtra."
        },
    ];

    return (
        <div className="about-us-container">
            <h1>About Us</h1>
            {sections.map((section, index) => (
                <div className={`section ${index % 2 === 0 ? 'image-left' : 'image-right'}`} key={index}>
                    <div className="section-content">
                        <h2><i className={section.icon}></i> {section.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    </div>
                    <div className="section-image-container">
                        <img src={section.image} alt={section.title} className="section-image" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AboutUs;