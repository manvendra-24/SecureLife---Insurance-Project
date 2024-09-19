import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ClaimModal = ({ show, handleClose, handleSubmitClaim, selectedPolicyId }) => {
  const [explanation, setExplanation] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]); 
  };

  const handleSubmit = () => {
    
    if (!explanation || !selectedFile) {
      alert('Please provide an explanation and upload a document.');
      return;
    }

  
    handleSubmitClaim(explanation, selectedFile, selectedPolicyId);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Submit Claim for Policy {selectedPolicyId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Explanation</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Provide an explanation for the claim"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Supported Document</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit Claim
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClaimModal;
