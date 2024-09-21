import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { viewPlanByScheme, updatePlanByScheme , createPlanByScheme} from '../../../services/AdminService';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import NewToast, { showToast } from '../../../sharedComponents/NewToast';
import BackButton from '../../../sharedComponents/BackButton';
import { isInRange, greaterThan, onlyPositive } from '../../../utils/helpers/Validation';

const InsurancePlanForm = () => {
  const { schemeId } = useParams();
  const [update , setUpdate] = useState(false);
  const [planDetails, setPlanDetails] = useState({
    insuranceSchemeId: schemeId,
    minimumPolicyTerm: '',
    maximumPolicyTerm: '',
    minimumAge: '',
    maximumAge: '',
    minimumInvestmentAmount: '',
    maximumInvestmentAmount: '',
    profitRatio: '',
    active: true,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const plan = await viewPlanByScheme(schemeId);
        if (plan) {
          setPlanDetails(plan);
          setUpdate(true);
        }
      } catch (error) {
        showToast('Error fetching plan details', 'error');
      }
    };

    fetchPlan();
  }, [schemeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlanDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
  
    newErrors.minimumPolicyTerm = onlyPositive(planDetails.minimumPolicyTerm) || 
                                  greaterThan(planDetails.minimumPolicyTerm, planDetails.maximumPolicyTerm);
    newErrors.maximumPolicyTerm = onlyPositive(planDetails.maximumPolicyTerm);
  
    newErrors.minimumAge = onlyPositive(planDetails.minimumAge) || 
                           greaterThan(planDetails.minimumAge, planDetails.maximumAge);
    newErrors.maximumAge = onlyPositive(planDetails.maximumAge);
  
    newErrors.minimumInvestmentAmount = onlyPositive(planDetails.minimumInvestmentAmount) || 
                                        greaterThan(planDetails.minimumInvestmentAmount, planDetails.maximumInvestmentAmount);
    newErrors.maximumInvestmentAmount = onlyPositive(planDetails.maximumInvestmentAmount);
  
    newErrors.profitRatio = onlyPositive(planDetails.profitRatio) || isInRange(planDetails.profitRatio,0,2);
  
    setErrors(newErrors);
  
    return Object.values(newErrors).every((error) => error === undefined || error === "");
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        if(update){
          await updatePlanByScheme(schemeId, planDetails);
        }
        else{
          await createPlanByScheme(schemeId, planDetails);
        }
        showToast('Plan updated successfully!', 'success');
        setTimeout(()=>{navigate(-1)},500)
        
      } catch (error) {
        showToast('Failed to update plan', 'error');
      }
    } else {
      showToast('Please correct the errors in the form.', 'error');
    }
  };
  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="w-100 justify-content-center">
          <Col md={8}>
            <Card className="p-4 shadow-lg" style={{ backgroundColor: 'rgba(230, 242, 255, 0.85)' }}>
              <Card.Body>
                <h3 className="text-center mb-4">Insurance Plan</h3>
                <Form onSubmit={handleSubmit}>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="minimumPolicyTerm">
                        <Form.Label>Minimum Policy Term (Years)</Form.Label>
                        <Form.Control
                          type="number"
                          name="minimumPolicyTerm"
                          value={planDetails.minimumPolicyTerm}
                          onChange={handleChange}
                          isInvalid={!!errors.minimumPolicyTerm}
                        />
                        <Form.Control.Feedback type="invalid">
                        {"Minimum Policy term should be less than Maximum Policy term"}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="maximumPolicyTerm">
                        <Form.Label>Maximum Policy Term (Years)</Form.Label>
                        <Form.Control
                          type="number"
                          name="maximumPolicyTerm"
                          value={planDetails.maximumPolicyTerm}
                          onChange={handleChange}
                          isInvalid={!!errors.maximumPolicyTerm}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="minimumAge">
                        <Form.Label>Minimum Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="minimumAge"
                          value={planDetails.minimumAge}
                          onChange={handleChange}
                          isInvalid={!!errors.minimumAge}
                        />
                        <Form.Control.Feedback type="invalid">
                          {"Minimum age should be less than Maximum age"}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="maximumAge">
                        <Form.Label>Maximum Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="maximumAge"
                          value={planDetails.maximumAge}
                          onChange={handleChange}
                          isInvalid={!!errors.maximumAge}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="minimumInvestmentAmount">
                        <Form.Label>Minimum Investment Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="minimumInvestmentAmount"
                          value={planDetails.minimumInvestmentAmount}
                          onChange={handleChange}
                          isInvalid={!!errors.minimumInvestmentAmount}
                        />
                        <Form.Control.Feedback type="invalid">
                          {"Minimum investment amount should be less than Maximum investment amount"}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="maximumInvestmentAmount">
                        <Form.Label>Maximum Investment Amount</Form.Label>
                        <Form.Control
                          type="number"
                          name="maximumInvestmentAmount"
                          value={planDetails.maximumInvestmentAmount}
                          onChange={handleChange}
                          isInvalid={!!errors.maximumInvestmentAmount}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Form.Group controlId="profitRatio">
                        <Form.Label>Profit Ratio</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.01"
                          name="profitRatio"
                          value={planDetails.profitRatio}
                          onChange={handleChange}
                          isInvalid={!!errors.profitRatio}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.profitRatio}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="active">
                        <Form.Check
                          type="checkbox"
                          label="Active"
                          name="active"
                          checked={planDetails.active}
                          onChange={(e) => setPlanDetails((prev) => ({ ...prev, active: e.target.checked }))}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col md={6}>
                      <Button type="submit" variant="primary">
                        Update Plan
                      </Button>
                    </Col>
                    <Col md={6} className="justify-content-end align-items-center" style={{ textAlign: 'right' }}>
                      <BackButton />
                    </Col>
                  </Row>
                </Form>
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

export default InsurancePlanForm;