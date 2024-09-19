import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

import { registerCustomer } from '../services/AdminService';
import { getAllCitiesList } from '../services/AgentService';
import Header from './layout/Header';
import Footer from './layout/Footer';
import NewToast, { showToast } from '../sharedComponents/NewToast';
import { required, isEmail, isAlphaWithSpace, checkSize, isAlphaNumNoSpace, onlyPositive, isFutureDate, isTenDigits, isAlphanumeric16 } from '../utils/helpers/Validation';
import BackButton from '../sharedComponents/BackButton';

const CustomerSignUp = () => {
  const [cities, setCities] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    dob: '',
    address: '',
    phoneNumber: '',
    bankAccountDetails: '',
    cityId: '',
    username: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await getAllCitiesList();
        const sortedCities = response.sort((a, b) => a.name.localeCompare(b.name));
        setCities(sortedCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    newErrors.name = required(customerDetails.name) || isAlphaWithSpace(customerDetails.name);
    newErrors.dob = required(customerDetails.dob) || isFutureDate(customerDetails.dob);
    newErrors.address = required(customerDetails.address);
    newErrors.phoneNumber = required(customerDetails.phoneNumber) || isTenDigits(customerDetails.phoneNumber);
    newErrors.bankAccountDetails = required(customerDetails.bankAccountDetails) || isAlphanumeric16(customerDetails.bankAccountDetails);
    newErrors.cityId = required(customerDetails.cityId);
    newErrors.username = required(customerDetails.username) || isAlphaNumNoSpace(customerDetails.username);
    newErrors.email = required(customerDetails.email) || isEmail(customerDetails.email);
    newErrors.password = required(customerDetails.password) || checkSize(customerDetails.password, 6, 20);

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => error === undefined || error === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        await registerCustomer(customerDetails);
        showToast('Registered successfully!', 'success');
        setTimeout(() => { navigate('/SecureLife.com/login') }, 500);
      } catch (error) {
        showToast(error.specificMessage || 'Registration failed', 'error');
      }
    } else {
      showToast('Please correct the errors in the form.', 'error');
    }
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 d-flex justify-content-center align-items-center" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="w-100 justify-content-center">
          <Col md={6}>
            <Card className="p-4 shadow-lg" style={{ backgroundColor: 'rgba(230, 242, 255, 0.85)' }}>
              <Card.Body>
                <h3 className="text-center mb-4">Customer Sign Up</h3>
                <Form onSubmit={handleSubmit}>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your name"
                          name="name"
                          value={customerDetails.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="dob">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="dob"
                          value={customerDetails.dob}
                          onChange={handleChange}
                          isInvalid={!!errors.dob}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.dob}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your address"
                          name="address"
                          value={customerDetails.address}
                          onChange={handleChange}
                          isInvalid={!!errors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.address}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="phoneNumber">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your phone number"
                          name="phoneNumber"
                          value={customerDetails.phoneNumber}
                          onChange={handleChange}
                          isInvalid={!!errors.phoneNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phoneNumber}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="bankAccountDetails">
                        <Form.Label>Bank Account Details</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your bank account details"
                          name="bankAccountDetails"
                          value={customerDetails.bankAccountDetails}
                          onChange={handleChange}
                          isInvalid={!!errors.bankAccountDetails}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.bankAccountDetails}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="cityId">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          as="select"
                          name="cityId"
                          value={customerDetails.cityId}
                          onChange={handleChange}
                          isInvalid={!!errors.cityId}
                        >
                          <option value="" disabled>Select your city</option>
                          {cities.map((city) => (
                            <option key={city.cityId} value={city.cityId}>
                              {city.name}
                            </option>
                          ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.cityId}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your username"
                          name="username"
                          value={customerDetails.username}
                          onChange={handleChange}
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          name="email"
                          value={customerDetails.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={12}>
                      <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          type="password"
                          placeholder="Enter your password"
                          name="password"
                          value={customerDetails.password}
                          onChange={handleChange}
                          isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Button type="submit" variant="primary" className="align-items-center justify-content-center">
                        Sign Up
                      </Button>
                    </Col>
                    <Col md={6} className="justify-content-end align-items-center" style={{ textAlign: 'right' }}>
                      <BackButton />
                    </Col>
                  </Row>
                </Form>
                <div className="text-center mt-3">
                  <span>Already have an account? </span>
                  <Link to="/SecureLife.com/login" className="text-decoration-none">
                    Login here
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <NewToast />
      <Footer />
    </Container>
  );
};

export default CustomerSignUp;