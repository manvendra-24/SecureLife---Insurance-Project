import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import NewToast, { showToast } from '../../../sharedComponents/NewToast';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import { required, onlyPositive } from '../../../utils/helpers/Validation';
import { addInsuranceScheme } from '../../../services/AdminService';
import { verifyAdmin } from '../../../services/AuthService';

const AddSchemeForm = () => {
  const navigate = useNavigate();
  const [schemeName, setSchemeName] = useState('');
  const [description, setDescription] = useState('');
  const [newRegistrationCommission, setNewRegistrationCommission] = useState('');
  const [withdrawalPenalty, setWithdrawalPenalty] = useState('');
  const [errors, setErrors] = useState({});
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const { typeId } = useParams();
  console.log(typeId);

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
    newErrors.schemeName = required(schemeName);
    newErrors.description = required(description);
    newErrors.newRegistrationCommission = onlyPositive(newRegistrationCommission);
    newErrors.withdrawalPenalty = onlyPositive(withdrawalPenalty);
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === undefined || error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await addInsuranceScheme(typeId, {
          schemeName,
          description,
          newRegistrationCommission,
          withdrawalPenalty,
        });
        showToast('Insurance scheme added successfully', 'success');
        setTimeout(() => { navigate(`/SecureLife.com/admin/types/${typeId}/schemes`); }, 500);
      } catch (error) {
        showToast('Failed to add insurance scheme. Please try again.', 'error');
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
                <h3>Add Insurance Scheme</h3>
                <p className="text-muted">Fill in the details to add a new insurance scheme.</p>
              </div>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formSchemeName" className="mb-3">
                  <Form.Label>Scheme Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={schemeName}
                    onChange={(e) => setSchemeName(e.target.value)}
                    isInvalid={!!errors.schemeName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.schemeName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formDescription" className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.description}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formNewRegistrationCommission" className="mb-3">
                  <Form.Label>New Registration Commission</Form.Label>
                  <Form.Control
                    type="text"
                    value={newRegistrationCommission}
                    onChange={(e) => setNewRegistrationCommission(e.target.value)}
                    isInvalid={!!errors.newRegistrationCommission}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.newRegistrationCommission}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formWithdrawalPenalty" className="mb-3">
                  <Form.Label>Withdrawal Penalty</Form.Label>
                  <Form.Control
                    type="text"
                    value={withdrawalPenalty}
                    onChange={(e) => setWithdrawalPenalty(e.target.value)}
                    isInvalid={!!errors.withdrawalPenalty}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.withdrawalPenalty}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Add Insurance Scheme
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

export default AddSchemeForm;
