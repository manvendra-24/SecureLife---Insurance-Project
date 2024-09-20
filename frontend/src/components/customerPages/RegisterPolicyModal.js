import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { registerPolicy } from '../../services/CustomerService';
import { successToast, errorToast } from '../../sharedComponents/MyToast';
import { isAlphaNumNoSpace} from '../../utils/helpers/Validation';


const RegisterPolicyModal = ({ show, handleClose, planId, minTerm, maxTerm, minAge, maxAge, minInvestment, maxInvestment, customerAge, handleSuccess }) => {
  const [policyTerm, setPolicyTerm] = useState('');
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState('');
  const [paymentInterval, setPaymentInterval] = useState('Quarterly');
  const [agentId, setAgentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [policyTerm, totalInvestmentAmount, agentId]);

  const validateForm = () => {
    const isValid = 
      policyTerm &&
      totalInvestmentAmount &&
      policyTerm >= minTerm && 
      policyTerm <= maxTerm &&
      totalInvestmentAmount >= minInvestment &&
      totalInvestmentAmount <= maxInvestment &&
      (!agentId || !isAlphaNumNoSpace(agentId));
    setIsFormValid(isValid);
  };

  const handleChange = (e, setter) => {
    setter(e.target.value);
  };
 

  const handleSubmit = async () => {
    setLoading(true);
    if (customerAge < minAge || customerAge > maxAge) {
      errorToast('Sorry, you are not eligible for this policy.');
      setLoading(false); 
      return;
    }

    if (!isFormValid) {
      toast.error('Please correct the errors in the form.');
      setLoading(false); 
      return;
    }

    const policyRequest = {
      plan_id: planId,
      policyTerm: parseInt(policyTerm),
      totalInvestmentAmount: parseInt(totalInvestmentAmount),
      paymentInterval,
      agent_id: agentId || null,
    };

    try {
      
      await registerPolicy(policyRequest);
      setLoading(false);
      handleClose(); 
      handleSuccess(); 
      
    } catch (error) {

      setLoading(false); 
      console.log(error.specificMessage);
      handleClose(); 
       errorToast(error.specificMessage);
       
   
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Register Insurance Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="planId">
          <Form.Label>Plan ID</Form.Label>
          <Form.Control type="text" value={planId} readOnly />
        </Form.Group>

        <Form.Group controlId="policyTerm">
          <Form.Label>Policy Term (in years)</Form.Label>
          <Form.Control
            type="number"
            value={policyTerm}
            onChange={(e) => handleChange(e, setPolicyTerm)}
            isInvalid={policyTerm && (policyTerm < minTerm || policyTerm > maxTerm)}
          />
          <Form.Control.Feedback type="invalid">
            Policy term must be between {minTerm} and {maxTerm} years.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="totalInvestmentAmount">
          <Form.Label>Total Investment Amount</Form.Label>
          <Form.Control
            type="number"
            value={totalInvestmentAmount}
            onChange={(e) => handleChange(e, setTotalInvestmentAmount)}
            isInvalid={totalInvestmentAmount && (totalInvestmentAmount < minInvestment || totalInvestmentAmount > maxInvestment)}
          />
          <Form.Control.Feedback type="invalid">
            Policy Investment Amount must be between ₹{minInvestment} and ₹{maxInvestment}.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="paymentInterval">
          <Form.Label>Payment Interval</Form.Label>
          <Form.Control
            as="select"
            value={paymentInterval}
            onChange={(e) => setPaymentInterval(e.target.value)}
          >
            <option value="QUARTERLY">Quarterly</option>
            <option value="HALF_YEARLY">Half-Yearly</option>
            <option value="YEARLY">Yearly</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="agentId">
          <Form.Label>Agent ID (Optional)</Form.Label>
          <Form.Control
            type="text"
            value={agentId}
            onChange={(e) => handleChange(e, setAgentId)}
            isInvalid={agentId && isAlphaNumNoSpace(agentId)}
            placeholder="Enter agent ID (optional)"
          />
          <Form.Control.Feedback type="invalid">
            Enter valid Agent Id
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Text className="text-muted">
          This insurance plan is eligible for customers between {minAge} and {maxAge} years old.
        </Form.Text>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || !isFormValid}>
          {loading ? 'Registering...' : 'Register Policy'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterPolicyModal;
