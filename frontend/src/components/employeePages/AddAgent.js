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
import Loader from '../../sharedComponents/Loader';
import { required, isEmail, checkSize, isAlphaNumNoSpace, isTenDigits} from '../../utils/helpers/Validation';

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

  const [errors, setErrors] = useState({});
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

  const validate = () => {
    let tempErrors = {};
    tempErrors.username = required(formData.username) || isAlphaNumNoSpace(formData.username) || checkSize(formData.username, 4, 50);
    tempErrors.password = required(formData.password) || checkSize(formData.password, 8, 20);
    tempErrors.email = required(formData.email) || isEmail(formData.email);
    tempErrors.phoneNumber = required(formData.phoneNumber) || isTenDigits(formData.phoneNumber);
    tempErrors.address = required(formData.address) || checkSize(formData.address, 0, 255);
    tempErrors.name = required(formData.name) || checkSize(formData.name, 2, 100);
    tempErrors.city_id = required(formData.city_id) || isAlphaNumNoSpace(formData.city_id);

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === undefined || x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
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
    } else {
      errorToast("Please correct the errors in the form.");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 px-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.4)' }}>
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
                  isInvalid={!!errors.username}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  isInvalid={!!errors.phoneNumber}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  isInvalid={!!errors.address}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.address}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="city_id">
                <Form.Label>City ID</Form.Label>
                <Form.Control
                  type="text"
                  name="city_id"
                  value={formData.city_id}
                  onChange={handleChange}
                  isInvalid={!!errors.city_id}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city_id}
                </Form.Control.Feedback>
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
      </Container>
      <Footer />
      <ToastContainer />
    </Container>
  );
};

export default AddAgentForm;
