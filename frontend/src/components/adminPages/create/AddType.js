import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import NewToast, { showToast } from '../../../sharedComponents/NewToast';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { required } from '../../../utils/helpers/Validation';
import { addInsuranceType } from '../../../services/AdminService';
import { verifyAdmin } from '../../../services/AuthService';

const AddInsuranceTypeForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdmin = await verifyAdmin();
        if (isAdmin) {
          setIsAdmin(true);
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

    checkAdminStatus();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    newErrors.name = required(name);
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === undefined);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addInsuranceType({ name, active });
        showToast('Insurance type added successfully', 'success');
        navigate('/SecureLife.com/admin/types');
      } catch (error) {
        showToast('Failed to add insurance type. Please try again.', 'error');
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
                <h3>Add Insurance Type</h3>
                <p className="text-muted">Fill in the details to add a new insurance type.</p>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formInsuranceTypeName" className="mb-3">
                  <Form.Label>Insurance Type Name</Form.Label>
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
                <Form.Group controlId="formInsuranceTypeActive" className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Control
                    as="select"
                    value={active}
                    onChange={(e) => setActive(e.target.value === 'true')}
                  >
                    <option value={true}>ACTIVE</option>
                    <option value={false}>INACTIVE</option>
                  </Form.Control>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Add Insurance Type
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

export default AddInsuranceTypeForm;
