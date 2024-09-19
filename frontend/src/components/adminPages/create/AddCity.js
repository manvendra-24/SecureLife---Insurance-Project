import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import NewToast, { showToast } from '../../../sharedComponents/NewToast';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { required, checkSize } from '../../../utils/helpers/Validation';
import { addCity, getAllStatesList } from '../../../services/AdminService';
import { verifyAdmin } from '../../../services/AuthService';

const AddCity = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [stateId, setStateId] = useState('');
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdmin = await verifyAdmin();
        if (isAdmin) {
          setIsAdmin(true);
          fetchStates();
        } else {
          showToast('Unauthorized Access! Please Login', 'error');
          setTimeout(() => {
            navigate('/SecureLife.com/login');
          }, 1000);
        }
      } catch (error) {
        showToast('Internal Server Error', 'error');
        setTimeout(() => {
          navigate('/SecureLife.com/login');
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    const fetchStates = async () => {
      try {
        const statesData = await getAllStatesList();
        if (statesData) {
          setStates(statesData);
        } else {
          showToast('Failed to load states. Please try again.', 'error');
        }
      } catch (error) {
        showToast('Failed to load states. Please try again.', 'error');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    newErrors.name = required(name) || checkSize(name, 3, 50);
    newErrors.stateId = required(stateId);
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === undefined);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const cityData = { name, state_id: stateId };
        await addCity(cityData);
        showToast('City added successfully', 'success');
        setTimeout(()=>{
         navigate('/SecureLife.com/admin/cities')
        },500)
      } catch (error) {
        showToast('Failed to add city. Please try again.', 'error');
      }
    } else {
      showToast('Please fix the validation errors.', 'error');
    }
  };

  if (isAdmin === null || loading) {
    return null;
  }

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="w-100 justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="p-4 shadow-lg" style={{ backgroundColor: 'rgba(230, 242, 255, 0.85)', border: 'none', borderRadius: '10px' }}>
              <div className="text-center mb-4">
                <h3>Add City</h3>
                <p className="text-muted">Fill in the details to add a new city.</p>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCityName" className="mb-3">
                  <Form.Label>City Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formStateId" className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    as="select"
                    value={stateId}
                    onChange={(e) => setStateId(e.target.value)}
                    isInvalid={!!errors.stateId}
                    disabled={states.length === 0}
                  >
                    <option value="">Select a state</option>
                    {Array.isArray(states) && states.map((state) => (
                      <option key={state.stateId} value={state.stateId}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.stateId}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Add City
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
      <NewToast />
      <Footer />
    </Container>
  );
};

export default AddCity;
