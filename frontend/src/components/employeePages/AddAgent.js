import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addAgent } from '../../services/EmployeeService';
import { verifyEmployee } from '../../services/AuthService'; 
import { successToast, errorToast } from '../../sharedComponents/MyToast';
import { ToastContainer } from 'react-toastify';
import BackButton from '../../sharedComponents/BackButton';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AddAgentForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    address: '',
    name: '',
    city_id: '',
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmployeeStatus = async () => {
      try {
        const isEmployee = await verifyEmployee();
        if (!isEmployee) {
          navigate('/SecureLife.com/login');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error verifying employee:', error);
        navigate('/SecureLife.com/login');
      }
    };

    checkEmployeeStatus();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addAgent(formData);
      console.log('Agent added successfully:', response);
      successToast("Agent Added Successfully");
      setTimeout(() => {
        navigate('/SecureLife.com/employee/agents');
      }, 2000);  
    } catch (error) {
      console.error('Error adding agent:', error);
      errorToast("Failed to add agent");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container fluid className="mt-5 d-flex flex-column">
      <Header/>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2 className="text-center">Add New Agent</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="city_id">
              <Form.Label>City ID</Form.Label>
              <Form.Control
                type="text"
                name="city_id"
                value={formData.city_id}
                onChange={handleChange}
                required
              />
            </Form.Group>

           

          
            <div className="d-flex justify-content-start mt-3">
              <Button variant="primary" type="submit" className="me-2">
                Add Agent
              </Button>
              <BackButton />
            </div>
          </Form>
        </Col>
      </Row>
      <Footer/>
      <ToastContainer />
    </Container>
  );
};

export default AddAgentForm;
