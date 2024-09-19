import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {registerPolicy} from '../../services/CustomerService'
import { successToast,errorToast } from '../../sharedComponents/MyToast';
const RegisterPolicyModal = ({ show, handleClose, planId, minTerm, maxTerm, minAge, maxAge,minInvestment,maxInvestment,handleSuccess}) => {
  const [policyTerm, setPolicyTerm] = useState('');
  const [totalInvestmentAmount, setTotalInvestmentAmount] = useState('');
  const [paymentInterval, setPaymentInterval] = useState('Quarterly');
  const [agentId, setAgentId] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleSubmit = async () => {
    if (!policyTerm || !totalInvestmentAmount) {
      toast.error('Please fill out all the required fields.');
      return;
    }

    
    if (policyTerm < minTerm || policyTerm > maxTerm) {
      errorToast(`Policy term must be between ${minTerm} and ${maxTerm} years.`);
      return;
    }
    if(totalInvestmentAmount <minInvestment || totalInvestmentAmount > maxInvestment){
         errorToast(`policy Investment must be between ${minInvestment} and ${maxInvestment}`)
    }

   
    const policyRequest = {
      plan_id: planId,
      policyTerm: parseInt(policyTerm),
      totalInvestmentAmount: parseInt(totalInvestmentAmount),
      paymentInterval,
      agent_id: agentId || null, 
    };

    console.log('Policy Request:', policyRequest);

    try {
      setLoading(true); 
      const response = await registerPolicy(policyRequest); 
      handleSuccess();
      console.log('API Response:', response);
      setLoading(false); 
      handleClose(); 
    } catch (error) {
      console.error('Error registering policy:', error);
      toast.error('Failed to register policy. Please try again.');
      setLoading(false);
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
            onChange={(e) => setPolicyTerm(e.target.value)}
          />
          <Form.Text className="text-muted">
            Policy term must be between {minTerm} and {maxTerm} years.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="totalInvestmentAmount">
          <Form.Label>Total Investment Amount</Form.Label>
          <Form.Control
            type="number"
            value={totalInvestmentAmount}
            onChange={(e) => setTotalInvestmentAmount(e.target.value)}
          />
          <Form.Text className="text-muted">
            Policy Investment Amount must be between ₹{minInvestment} and ₹{maxInvestment} .
          </Form.Text>
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
            onChange={(e) => setAgentId(e.target.value)}
            placeholder="Enter agent ID (optional)"
          />
        </Form.Group>

        <Form.Text className="text-muted">
          This insurance plan is eligible for customers between {minAge} and {maxAge} years old.
        </Form.Text>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Registering...' : 'Register Policy'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RegisterPolicyModal;
