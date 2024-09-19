import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { submitCustomerQuery } from '../../services/CustomerService';
import { showToast } from '../../sharedComponents/NewToast';

const QueryModal = ({ show, handleClose }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !message) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const queryDetails = { subject, message };
      const response = await submitCustomerQuery(queryDetails);
      showToast(response, 'success');
      handleClose(); 
    } catch (error) {
      showToast('Failed to submit query', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Submit a Query</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="querySubject">
            <Form.Label>Subject</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="queryMessage" className="mt-3">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Enter your query message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Query'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QueryModal;
