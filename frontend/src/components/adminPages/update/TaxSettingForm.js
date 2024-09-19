import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { isInRange } from '../../../utils/helpers/Validation'; // Adjust path as needed

const TaxSettingForm = ({ show, handleClose, handleSave, initialTaxPercentage }) => {
  const [taxPercentage, setTaxPercentage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setTaxPercentage(initialTaxPercentage);
  }, [initialTaxPercentage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = isInRange(taxPercentage, 1, 50);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError('');
      handleSave({ taxPercentage });
      setIsEditing(false); // Exit edit mode after saving
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tax Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTaxPercentage">
            <Form.Label>Tax Percentage</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter tax percentage"
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(e.target.value)}
              isInvalid={!!error}
              disabled={!isEditing}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            {isEditing ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditing(false)} className="me-2">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Update
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default TaxSettingForm;
