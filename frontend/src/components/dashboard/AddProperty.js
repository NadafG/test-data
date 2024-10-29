// src/components/Properties/AddProperty.js
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { Tab, Tabs, Form, Button, Row, Col, Container, Card } from 'react-bootstrap';
import '../../AddProperty.css'; // Ensure this file exists in the same directory
import { FaHome, FaBuilding, FaStore } from 'react-icons/fa'; // Import icons
const AddProperty = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [propertyType, setPropertyType] = useState('plot');
    const [formData, setFormData] = useState({
        // Common Fields
        title: '',
        description: '',
        type: '', // Rent/Sale
        listedBy: '',
        price: '',
        location: '',
        images: [],
        facing: '',
        projectName: '',
        carParking: '',
        // Plot Specific Fields
        plotArea: '',
        length: '',
        breadth: '',
        // Flat Specific Fields
        bedroom: '',
        bathroom: '',
        furnishing: '',
        constructionStatus: '',
        superBuiltupArea: '',
        carpetArea: '',
        maintenance: '',
        totalFloors: '',
        floorNo: '',
    });

    const {
        title,
        description,
        type,
        listedBy,
        price,
        location,
        images,
        facing,
        projectName,
        carParking,
        plotArea,
        length,
        breadth,
        bedroom,
        bathroom,
        furnishing,
        constructionStatus,
        superBuiltupArea,
        carpetArea,
        maintenance,
        totalFloors,
        floorNo,
    } = formData;

    const onChange = e => {
        if (e.target.name === 'images') {
            setFormData({ ...formData, images: e.target.files });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const onSubmit = async e => {
        e.preventDefault();
        const data = new FormData();
        // Simple validation
        const errors = validateForm(formData);
        if (errors.length > 0) {
            errors.forEach((error) => {
                toast.error(error);
            });
            return; // Stop submission if there are validation errors
        }

        data.append('title', title);
        data.append('description', description);
        data.append('type', type);
        data.append('listedBy', listedBy);
        data.append('price', price);
        data.append('location', location);
        data.append('propertyType', propertyType);
        data.append('facing', facing);
        data.append('projectName', projectName);
        data.append('carParking', carParking);

        //alert(superBuiltupArea);

        if (propertyType === 'plot') {
            data.append('plotArea', plotArea);
            data.append('length', length);
            data.append('breadth', breadth);
        } else if (propertyType === 'flat') {
            data.append('bedroom', bedroom);
            data.append('bathroom', bathroom);
            data.append('furnishing', furnishing);
            data.append('constructionStatus', constructionStatus);
            data.append('superBuiltupArea', superBuiltupArea);
            data.append('carpetArea', carpetArea);
            data.append('maintenance', maintenance);
            data.append('totalFloors', totalFloors);
            data.append('floorNo', floorNo);

        } else if (propertyType === 'commercial') {
            data.append('furnishing', furnishing);
            data.append('constructionStatus', constructionStatus);
            data.append('superBuiltupArea', superBuiltupArea);
            data.append('carpetArea', carpetArea);
            data.append('maintenance', maintenance);
            data.append('totalFloors', totalFloors);
            data.append('floorNo', floorNo);
        }

        // Add Commercial-specific fields here if needed

        for (let i = 0; i < images.length; i++) {
            data.append('images', images[i]);
        }

        try {
            await axios.post('/api/properties/save', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            toast.success('Success! Your property is now listed.');
            setTimeout(() => {
                navigate('/my-property-list'); // Redirect to home page after success
            }, 3000);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to add property');
        }

    };

    if (!auth.token) {
        toast.error('Please log in first to access this feature.');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    }

    // Example validation function
    const validateForm = (data) => {

        //console.log(data);
        const errors = [];

        // Common validations
        if (!data.listedBy) errors.push('Listed By is required.');
        if (!data.projectName) errors.push('Project Name is required.');
        if (!data.price) errors.push('Price is required.');
        if (!data.location) errors.push('Location is required.');
        if (!data.description) errors.push('Description is required.');
        if (!data.facing) errors.push('Facing direction is required.');
        if (!data.images) errors.push('At least one image is required.');

        // Validation rules based on property type
        //alert('data.superBuiltUpAre' + data.superBuiltupArea);
        switch (propertyType) {
            case 'flat':
                if (!data.bedroom) errors.push('Bedrooms are required for flats.');
                if (!data.bathroom) errors.push('Bathrooms are required for flats.');
                if (!data.furnishing) errors.push('Furnishing type is required for flats.');
                if (!data.constructionStatus) errors.push('Construction status is required for flats.');
                if (!data.superBuiltupArea) errors.push('Super Built-Up Area is required for flats.');
                if (!data.carpetArea) errors.push('Carpet Area is required for flats.');
                if (!data.maintenance) errors.push('Maintenance cost is required for flats.');
                if (!data.totalFloors) errors.push('Total floors are required for flats.');
                if (!data.floorNo) errors.push('Floor number is required for flats.');
                if (!data.carParking) errors.push('Car parking details are required for flats.');
                break;

            case 'commercial':
                // if (!data.bedrooms) errors.push('Bedrooms are required for commercial properties.');
                // if (!data.bathrooms) errors.push('Bathrooms are required for commercial properties.');
                if (!data.furnishing) errors.push('Furnishing type is required for commercial properties.');
                if (!data.constructionStatus) errors.push('Construction status is required for commercial properties.');
                if (!data.superBuiltupArea) errors.push('Super Built-Up Area is required for commercial properties.');
                if (!data.carpetArea) errors.push('Carpet Area is required for commercial properties.');
                if (!data.maintenance) errors.push('Maintenance cost is required for commercial properties.');
                if (!data.totalFloors) errors.push('Total floors are required for commercial properties.');
                if (!data.floorNo) errors.push('Floor number is required for commercial properties.');
                if (!data.carParking) errors.push('Car parking details are required for commercial properties.');
                break;

            case 'plot':
                if (!data.plotArea) errors.push('Plot Area is required for plots.');
                if (!data.length) errors.push('Length is required for plots.');
                if (!data.breadth) errors.push('Breadth is required for plots.');
                break;

            default:
                errors.push('Invalid property type.');
                break;
        }

        // Return all collected errors
        return errors;
    };


    return (
        <Container className="my-5">
            <ToastContainer />
            <h2 className="text-center">Join Our Marketplace: Add Your Property!</h2>
            <Card>
                <Card.Body>
                    <Tabs
                        activeKey={propertyType}
                        onSelect={(k) => setPropertyType(k)}
                        className="mb-3"
                        justify
                    >
                        {/* Plot Tab */}
                        <Tab eventKey="plot" title={<><FaHome className="tab-lable me-2" />PLOT / LAND</>}>
                            <Form onSubmit={onSubmit} encType="multipart/form-data">
                                {/* Property Type and Listed By */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="type">
                                            <Form.Label>Type</Form.Label>
                                            <Form.Select
                                                name="type"
                                                value={type}
                                                onChange={onChange}

                                            >
                                                <option value="">Select type</option>
                                                <option value="Rent">Rent</option>
                                                <option value="Sale">Sale</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="listedBy">
                                            <Form.Label>Listed By</Form.Label>
                                            <Form.Select
                                                name="listedBy"
                                                value={listedBy}
                                                onChange={onChange}

                                            >
                                                <option value="">Select option</option>
                                                <option value="Owner">Owner</option>
                                                <option value="Agent">Agent</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Title and Price */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="title">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter property title"
                                                name="title"
                                                value={title}
                                                onChange={onChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="price">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter price"
                                                name="price"
                                                value={price}
                                                onChange={onChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                {/* Location and Project Name */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="location">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter location"
                                                name="location"
                                                value={location}
                                                onChange={onChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="projectName">
                                            <Form.Label>Project Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter project name"
                                                name="projectName"
                                                value={projectName}
                                                onChange={onChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Plot Area, Length, Breadth */}
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="plotArea">
                                            <Form.Label>Plot Area (sq ft)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter plot area"
                                                name="plotArea"
                                                value={plotArea}
                                                onChange={onChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="length">
                                            <Form.Label>Length (ft)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter length"
                                                name="length"
                                                value={length}
                                                onChange={onChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="breadth">
                                            <Form.Label>Breadth (ft)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter breadth"
                                                name="breadth"
                                                value={breadth}
                                                onChange={onChange}

                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Facing and Car Parking */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="facing">
                                            <Form.Label>Facing</Form.Label>
                                            <Form.Select
                                                name="facing"
                                                value={facing}
                                                onChange={onChange}

                                            >
                                                <option value="">Select facing</option>
                                                <option value="North">North</option>
                                                <option value="South">South</option>
                                                <option value="East">East</option>
                                                <option value="West">West</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="carParking">
                                            <Form.Label>Car Parking</Form.Label>
                                            <Form.Select
                                                name="carParking"
                                                value={carParking}
                                                onChange={onChange}

                                            >
                                                <option value="">Select option</option>
                                                <option value="Available">Available</option>
                                                <option value="Not Available">Not Available</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Description */}
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Describe What You Are Selling</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter property description"
                                        name="description"
                                        value={description}
                                        onChange={onChange}

                                    />
                                </Form.Group>

                                {/* Images */}
                                <Form.Group className="mb-3" controlId="images">
                                    <Form.Label>Images</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="images"
                                        onChange={onChange}
                                        multiple
                                        accept="image/*"

                                    />
                                </Form.Group>

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <Button variant="primary" type="submit">
                                        Add Plot
                                    </Button>
                                </div>
                            </Form>
                        </Tab>

                        {/* Flat Tab */}
                        <Tab eventKey="flat" title={<><FaBuilding className="tab-lable me-2" />FLAT</>}>
                            <Form onSubmit={onSubmit} encType="multipart/form-data">
                                {/* Property Type and Listed By */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="type">
                                            <Form.Label>Type</Form.Label>
                                            <Form.Select
                                                name="type"
                                                value={type}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select type</option>
                                                <option value="Rent">Rent</option>
                                                <option value="Sale">Sale</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="listedBy">
                                            <Form.Label>Listed By</Form.Label>
                                            <Form.Select
                                                name="listedBy"
                                                value={listedBy}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select option</option>
                                                <option value="Owner">Owner</option>
                                                <option value="Agent">Agent</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Title and Price */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="title">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter property title"
                                                name="title"
                                                value={title}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="price">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter price"
                                                name="price"
                                                value={price}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Location and Project Name */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="location">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter location"
                                                name="location"
                                                value={location}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="projectName">
                                            <Form.Label>Project Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter project name"
                                                name="projectName"
                                                value={projectName}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Bedroom and Bathroom */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="bedroom">
                                            <Form.Label>Bedroom</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter number of bedrooms"
                                                name="bedroom"
                                                value={bedroom}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="bathroom">
                                            <Form.Label>Bathroom</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter number of bathrooms"
                                                name="bathroom"
                                                value={bathroom}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Furnishing and Construction Status */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="furnishing">
                                            <Form.Label>Furnishing</Form.Label>
                                            <Form.Select
                                                name="furnishing"
                                                value={furnishing}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select furnishing</option>
                                                <option value="Furnished">Furnished</option>
                                                <option value="Semi-Furnished">Semi-Furnished</option>
                                                <option value="Unfurnished">Unfurnished</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="constructionStatus">
                                            <Form.Label>Construction Status</Form.Label>
                                            <Form.Select
                                                name="constructionStatus"
                                                value={constructionStatus}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select status</option>
                                                <option value="Under Construction">Under Construction</option>
                                                <option value="Ready to Move">Ready to Move</option>
                                                <option value="Resale">Resale</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Super Built-up Area and Carpet Area */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="superBuiltupArea">
                                            <Form.Label>Super Built-up Area (sq ft)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter super built-up area"
                                                name="superBuiltupArea"
                                                value={superBuiltupArea}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="carpetArea">
                                            <Form.Label>Carpet Area (sq ft)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter carpet area"
                                                name="carpetArea"
                                                value={carpetArea}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Maintenance, Total Floors, Floor No */}
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="maintenance">
                                            <Form.Label>Maintenance (Monthly)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter maintenance fee"
                                                name="maintenance"
                                                value={maintenance}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="totalFloors">
                                            <Form.Label>Total Floors</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter total floors"
                                                name="totalFloors"
                                                value={totalFloors}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="floorNo">
                                            <Form.Label>Floor No</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter floor number"
                                                name="floorNo"
                                                value={floorNo}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Facing and Car Parking */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="facing">
                                            <Form.Label>Facing</Form.Label>
                                            <Form.Select
                                                name="facing"
                                                value={facing}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select facing</option>
                                                <option value="North">North</option>
                                                <option value="South">South</option>
                                                <option value="East">East</option>
                                                <option value="West">West</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="carParking">
                                            <Form.Label>Car Parking</Form.Label>
                                            <Form.Select
                                                name="carParking"
                                                value={carParking}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select option</option>
                                                <option value="Available">Available</option>
                                                <option value="Not Available">Not Available</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Description */}
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Describe What You Are Selling</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter property description"
                                        name="description"
                                        value={description}
                                        onChange={onChange}
                                        required
                                    />
                                </Form.Group>

                                {/* Images */}
                                <Form.Group className="mb-3" controlId="images">
                                    <Form.Label>Images</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="images"
                                        onChange={onChange}
                                        multiple
                                        accept="image/*"
                                        required
                                    />
                                </Form.Group>

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <Button variant="success" type="submit">
                                        Add Flat
                                    </Button>
                                </div>
                            </Form>
                        </Tab>

                        {/* Flat Tab */}
                        <Tab eventKey="commercial" title={<><FaStore className="tab-lable me-2" />COMMERCIAL</>}>
                            <Form onSubmit={onSubmit} encType="multipart/form-data">
                                {/* Property Type and Listed By */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="type">
                                            <Form.Label>Type</Form.Label>
                                            <Form.Select
                                                name="type"
                                                value={type}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select type</option>
                                                <option value="Rent">Rent</option>
                                                <option value="Sale">Sale</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="listedBy">
                                            <Form.Label>Listed By</Form.Label>
                                            <Form.Select
                                                name="listedBy"
                                                value={listedBy}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select option</option>
                                                <option value="Owner">Owner</option>
                                                <option value="Agent">Agent</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Title and Price */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="title">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter property title"
                                                name="title"
                                                value={title}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="price">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter price"
                                                name="price"
                                                value={price}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Location and Project Name */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="location">
                                            <Form.Label>Location</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter location"
                                                name="location"
                                                value={location}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="projectName">
                                            <Form.Label>Project Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Enter project name"
                                                name="projectName"
                                                value={projectName}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>


                                {/* Furnishing and Construction Status */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="furnishing">
                                            <Form.Label>Furnishing</Form.Label>
                                            <Form.Select
                                                name="furnishing"
                                                value={furnishing}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select furnishing</option>
                                                <option value="Furnished">Furnished</option>
                                                <option value="Semi-Furnished">Semi-Furnished</option>
                                                <option value="Unfurnished">Unfurnished</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="constructionStatus">
                                            <Form.Label>Construction Status</Form.Label>
                                            <Form.Select
                                                name="constructionStatus"
                                                value={constructionStatus}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select status</option>
                                                <option value="Under Construction">Under Construction</option>
                                                <option value="Ready to Move">Ready to Move</option>
                                                <option value="Resale">Resale</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Super Built-up Area and Carpet Area */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="superBuiltupArea">
                                            <Form.Label>Super Built-up Area (sq ft)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter super built-up area"
                                                name="superBuiltupArea"
                                                value={superBuiltupArea}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="carpetArea">
                                            <Form.Label>Carpet Area (sq ft)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter carpet area"
                                                name="carpetArea"
                                                value={carpetArea}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Maintenance, Total Floors, Floor No */}
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="maintenance">
                                            <Form.Label>Maintenance (Monthly)</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter maintenance fee"
                                                name="maintenance"
                                                value={maintenance}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="totalFloors">
                                            <Form.Label>Total Floors</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter total floors"
                                                name="totalFloors"
                                                value={totalFloors}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-3" controlId="floorNo">
                                            <Form.Label>Floor No</Form.Label>
                                            <Form.Control
                                                type="number"
                                                placeholder="Enter floor number"
                                                name="floorNo"
                                                value={floorNo}
                                                onChange={onChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Facing and Car Parking */}
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="facing">
                                            <Form.Label>Facing</Form.Label>
                                            <Form.Select
                                                name="facing"
                                                value={facing}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select facing</option>
                                                <option value="North">North</option>
                                                <option value="South">South</option>
                                                <option value="East">East</option>
                                                <option value="West">West</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3" controlId="carParking">
                                            <Form.Label>Car Parking</Form.Label>
                                            <Form.Select
                                                name="carParking"
                                                value={carParking}
                                                onChange={onChange}
                                                required
                                            >
                                                <option value="">Select option</option>
                                                <option value="Available">Available</option>
                                                <option value="Not Available">Not Available</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Description */}
                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Describe What You Are Selling</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter property description"
                                        name="description"
                                        value={description}
                                        onChange={onChange}
                                        required
                                    />
                                </Form.Group>

                                {/* Images */}
                                <Form.Group className="mb-3" controlId="images">
                                    <Form.Label>Images</Form.Label>
                                    <Form.Control
                                        type="file"
                                        name="images"
                                        onChange={onChange}
                                        multiple
                                        accept="image/*"
                                        required
                                    />
                                </Form.Group>

                                {/* Submit Button */}
                                <div className="d-grid">
                                    <Button variant="success" type="submit">
                                        Add Commercial
                                    </Button>
                                </div>
                            </Form>
                        </Tab>


                    </Tabs>

                </Card.Body>
            </Card >
        </Container >
    );
};

export default AddProperty;
