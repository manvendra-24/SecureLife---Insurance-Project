import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomer } from '../../services/EmployeeService';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import Loader from '../../sharedComponents/Loader';
import BackButton from '../../sharedComponents/BackButton'; 
import Header from '../layout/Header';
import Footer from '../layout/Footer';
const CustomerUpdateForm = () => {
  const { customerId } = useParams();  
  const [customerData, setCustomerData] = useState(null);  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomerById(customerId);
        const formattedDob = data.dob ? new Date(data.dob).toISOString().split('T')[0] : '';
        setCustomerData({
          ...data,
          dob: formattedDob, 
        });
        setLoading(false);
      } catch (error) {
        toast.error('Error fetching customer details');
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(customerId, customerData);
      toast.success('Customer updated successfully');
      setTimeout(() => {
        navigate('/view-customers');
      }, 2000);  
    } catch (error) {
      toast.error('Error updating customer');
    }
  };

  if (loading || !customerData) {
    return <Loader />;  
  }

  return (
    <Container fluid className="px-0 d-flex flex-column min-vh-100">
    <Header role="employee" />
    
    <div className="content-container flex-grow-1">
      <Container className="mt-5">
        
      <h2 className="mt-4">Update Customer</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={customerData.name || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={customerData.username || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={customerData.phoneNumber || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={customerData.dob || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={customerData.address || ''}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="verifiedby">
              <Form.Label>Verified By</Form.Label>
              <Form.Control
                type="text"
                name="verifiedby"
                value={customerData.verifiedby || ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="agent">
              <Form.Label>Agent</Form.Label>
              <Form.Control
                type="text"
                name="agent"
                value={customerData.agent || ''}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city_id">
              <Form.Label>City ID</Form.Label>
              <Form.Control
                type="text"
                name="city_id"
                value={customerData.city_id || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
                <Col>
                <Button variant="primary" type="submit" className="mt-3">
                    Update Customer
                </Button>
                </Col>
                <Col style={{textAlign:'right'}} className="mt-3 mb-3" >
                 <BackButton/>
                </Col>
                </Row>
      </Form>
      <ToastContainer />
    </Container>
    
        </div>
        <Footer/>
    </Container>
  );
};

export default CustomerUpdateForm;
