import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInsurancePlanBySchemeId } from '../../services/CustomerService'; 
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import CustomerHeader from '../layout/CustomerHeader';
import Footer from '../layout/Footer';
import RegisterPolicyModal from './RegisterPolicyModal';
import { successToast, errorToast } from '../../sharedComponents/MyToast';
import BackButton from '../../sharedComponents/BackButton';
import { verifyCustomer } from '../../services/AuthService'; 

const InsurancePlanByScheme = () => {
  const { schemeId } = useParams();
  const [plan, setPlan] = useState(null); 
  const [showModal, setShowModal] = useState(false); 
  const [isCustomer, setIsCustomer] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const checkCustomerStatus = async () => {
      try {
        const isCustomer = await verifyCustomer(); 
        setIsCustomer(isCustomer);
        if (!isCustomer) {
          navigate('/SecureLife.com/login');
        }
      } catch (error) {
        console.error('Error during customer verification:', error);
        navigate('/SecureLife.com/login');
      }
    };

    checkCustomerStatus();
  }, [navigate]);

  useEffect(() => {
    if (isCustomer) {
      const fetchPlan = async () => {
        try {
          const response = await getInsurancePlanBySchemeId(schemeId);
          console.log('Fetched Plan:', response.content[0]); 
          setPlan(response.content[0]); 
        } catch (error) {
          console.error('Error fetching plan:', error);
          errorToast('Failed to fetch insurance plan details.');
        }
      };

      fetchPlan();
    }
  }, [schemeId, isCustomer]);

  const handleOpenModal = () => {
    if (plan) {
      setShowModal(true); 
    }
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  const handleSuccess = () => {
    successToast('Policy registered successfully!');
    setShowModal(false);
  };

  return (
    <Container fluid className="px-0">
      <CustomerHeader />
      <Container fluid className="px-5 py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="justify-content-center py-5">
          <h2 className="text-center">Insurance Plan Details</h2>
          {plan ? (
            <Col md={8} className="my-3">
              <Card className="text-center shadow" style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(193, 220, 220, 0.5)' }}>
                <Card.Body>
                  <Card.Title>Plan for Scheme: {plan.insuranceSchemeName}</Card.Title>
                  <Card.Text><strong>Insurance Plan ID:</strong> {plan.insuranceId}</Card.Text>
                  <Card.Text><strong>Scheme ID:</strong> {plan.insuranceSchemeId}</Card.Text>
                  <Card.Text><strong>Scheme Name:</strong> {plan.insuranceSchemeName}</Card.Text>
                  <Card.Text><strong>Minimum Policy Term:</strong> {plan.minimumPolicyTerm} years</Card.Text>
                  <Card.Text><strong>Maximum Policy Term:</strong> {plan.maximumPolicyTerm} years</Card.Text>
                  <Card.Text><strong>Minimum Age:</strong> {plan.minimumAge} years</Card.Text>
                  <Card.Text><strong>Maximum Age:</strong> {plan.maximumAge} years</Card.Text>
                  <Card.Text><strong>Minimum Investment Amount:</strong> ₹{plan.minimumInvestmentAmount}</Card.Text>
                  <Card.Text><strong>Maximum Investment Amount:</strong> ₹{plan.maximumInvestmentAmount}</Card.Text>
                  <Card.Text><strong>Profit Ratio:</strong> {plan.profitRatio}%</Card.Text>
                  <Card.Text><strong>Active Status:</strong> {plan.active ? 'Active' : 'Inactive'}</Card.Text>
                  <Button variant="primary" onClick={handleOpenModal}>
                    Register Policy
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <p className="text-center">No plan details available for this scheme.</p>
          )}
        </Row>
        <Row>
          <Col style={{ textAlign: 'right' }}>
            <BackButton />
          </Col>
        </Row>
      </Container>
      <Footer />

      {plan && (
        <RegisterPolicyModal
          show={showModal}
          handleClose={handleCloseModal}
          planId={plan.insuranceId}
          minTerm={plan.minimumPolicyTerm}
          maxTerm={plan.maximumPolicyTerm}
          minAge={plan.minimumAge}
          maxAge={plan.maximumAge}
          minInvestment={plan.minimumInvestmentAmount}
          maxInvestment={plan.maximumInvestmentAmount}
          handleSuccess={handleSuccess}
        />
      )}
    </Container>
  );
};

export default InsurancePlanByScheme;
