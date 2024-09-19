import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { uploadDocument } from '../../services/CustomerService'; 
import { showToast } from '../../sharedComponents/NewToast'; 

const documentTypes = [
  { value: 'AADHAR', label: 'Aadhar' },
  { value: 'PAN_CARD', label: 'PAN Card' },
  // { value: 'CLAIM_DOCUMENT', label: 'Claim Document' },
  { value: 'HEALTH_CERTIFICATE', label: 'Health Certificate' },
];

const DocumentUploadModal = ({ show, handleClose }) => {
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  
  const handleDocumentTypeChange = (e) => {
    setDocumentType(e.target.value);
  };

 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 
  const handleUpload = async () => {
    if (!documentType || !file) {
      showToast('Please select a document type and file', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await uploadDocument(documentType, file);
      showToast('Document uploaded successfully', 'success');
      handleClose(); 
    } catch (error) {
      showToast('Failed to upload document', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Document</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="documentType">
            <Form.Label>Select Document Type</Form.Label>
            <Form.Control as="select" value={documentType} onChange={handleDocumentTypeChange}>
              <option value="">-- Select Document Type --</option>
              {documentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="fileUpload" className="mt-3">
            <Form.Label>Upload File</Form.Label>
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpload} disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentUploadModal;
