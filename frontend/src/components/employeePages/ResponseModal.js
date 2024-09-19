import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { submitQueryResponse } from '../../services/CustomerService';
import { showToast } from '../../sharedComponents/NewToast';

const ResponseModal = ({ show, handleClose, selectedQuery, refreshQueries }) => {
  const [response, setResponse] = useState('');

  const handleSubmitResponse = async () => {
    try {
      const responseBody = { response };
      await submitQueryResponse(selectedQuery.queryId, responseBody); 
      showToast('Response submitted successfully', 'success');
      handleClose(); 
      refreshQueries(); 
    } catch (error) {
      showToast('Failed to submit response', 'error');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Respond to Query</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="queryResponse">
            <Form.Label>Response</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Enter your response"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmitResponse}>
          Submit Response
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResponseModal;
