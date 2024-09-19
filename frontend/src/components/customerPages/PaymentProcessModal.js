import React, { useState } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { processPayment } from '../../services/CustomerService'; 
import { errorToast, successToast } from '../../sharedComponents/MyToast';
import { useNavigate } from 'react-router-dom';

const PaymentProcessModal = ({ show, handleClose, fetchData,installmentAmount, policyId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  
  const handlePayment = async () => {
    if (!stripe || !elements || installmentAmount === null) return; 

    setLoading(true); 
    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Stripe error:', error);
        errorToast('Payment failed, please try again.');
        setLoading(false);
        return;
      }

      
      const paymentRequestDto = {
        policyAccountId: policyId,
        amount: installmentAmount, 
        stripePaymentMethodId: paymentMethod.id, 
      };

      
      const response = await processPayment(paymentRequestDto);

      successToast('Payment succeeded!');
      fetchData(); 
      handleClose(); 
    } catch (paymentError) {
      console.error('Payment error:', paymentError);
      errorToast('Payment failed, please try again.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Process Payment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Paying for installment of amount <strong>{installmentAmount}</strong> INR:</p>
        <div>
          <label>Card Details</label>
          <CardElement /> 
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? <Spinner animation="border" size="sm" /> : 'Pay Now'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PaymentProcessModal;
