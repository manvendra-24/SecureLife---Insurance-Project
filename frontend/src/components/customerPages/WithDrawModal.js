import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const WithdrawModal = ({ show, handleClose, handleSubmitWithdraw, policyId, policyName }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Withdraw Policy</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Do you really want to withdraw the policy with ID: <strong>{policyId}</strong>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="primary" onClick={() => handleSubmitWithdraw(policyId)}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WithdrawModal;
