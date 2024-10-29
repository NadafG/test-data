// src/components/Layout/Testimonials.js
import React from 'react';

const testimonialsData = [
    {
        id: 1,
        text: "This platform helped me find my dream home quickly!",
        author: "John Doe",
    },
    {
        id: 2,
        text: "Excellent service and great properties to choose from.",
        author: "Jane Smith",
    },
];

const Testimonials = () => {
    return (
        <div className="row">
            {testimonialsData.map(testimonial => (
                <div className="col-md-6 mb-4" key={testimonial.id}>
                    <div className="testimonial p-4 border rounded bg-light">
                        <p>"{testimonial.text}"</p>
                        <h5 className="text-end">- {testimonial.author}</h5>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Testimonials;
