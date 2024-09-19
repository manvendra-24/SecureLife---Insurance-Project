import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { onlyPositive } from '../../../utils/helpers/Validation';
import { FaPercent } from 'react-icons/fa'; 

const InsuranceSettingForm = ({ show, handleClose, handleSave, initialClaimDeduction, initialWithdrawalPenalty, initialLatePenalty }) => {
  const [claimDeduction, setClaimDeduction] = useState('');
  const [withdrawalPenalty, setWithdrawalPenalty] = useState('');
  const [latePenalty, setLatePenalty] = useState('');
  const [error, setError] = useState('');
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    setClaimDeduction(initialClaimDeduction);
    setWithdrawalPenalty(initialWithdrawalPenalty);
    setLatePenalty(initialLatePenalty);
  }, [initialClaimDeduction, initialWithdrawalPenalty, initialLatePenalty]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const claimDeductionValue = Number(claimDeduction);
    const withdrawalPenaltyValue = Number(withdrawalPenalty);
    const latePenaltyValue = Number(latePenalty);

    const claimDeductionError = onlyPositive(claimDeductionValue);
    const withdrawalPenaltyError = onlyPositive(withdrawalPenaltyValue);
    const latePenaltyError = onlyPositive(latePenaltyValue);

    if (claimDeductionError || withdrawalPenaltyError || latePenaltyError) {
      setError(`Claim Deduction Error: ${claimDeductionError}, Withdrawal Penalty Error: ${withdrawalPenaltyError}, Late Penalty Error: ${latePenaltyError}`);
    } else {
      setError('');
      handleSave({ claimDeduction: claimDeductionValue, withdrawalPenalty: withdrawalPenaltyValue, latePenalty: latePenaltyValue });
      setIsEditable(false); 
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Insurance Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formClaimDeduction">
            <Form.Label>Claim Deduction</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter claim deduction"
                value={claimDeduction}
                onChange={(e) => setClaimDeduction(e.target.value)}
                isInvalid={!!error && error.includes('Claim Deduction Error')}
                disabled={!isEditable}
              />
              <InputGroup.Text>
                <FaPercent /> 
              </InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {error && error.includes('Claim Deduction Error') ? error.split('Claim Deduction Error: ')[1] : ''}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formWithdrawalPenalty">
            <Form.Label>Withdrawal Penalty</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter withdrawal penalty"
                value={withdrawalPenalty}
                onChange={(e) => setWithdrawalPenalty(e.target.value)}
                isInvalid={!!error && error.includes('Withdrawal Penalty Error')}
                disabled={!isEditable}
              />
              <InputGroup.Text>
                <FaPercent /> 
              </InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {error && error.includes('Withdrawal Penalty Error') ? error.split('Withdrawal Penalty Error: ')[1] : ''}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formLatePenalty">
            <Form.Label>Late Penalty</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter late penalty"
                value={latePenalty}
                onChange={(e) => setLatePenalty(e.target.value)}
                isInvalid={!!error && error.includes('Late Penalty Error')}
                disabled={!isEditable}
              />
              <InputGroup.Text>
                <FaPercent /> 
              </InputGroup.Text>
            </InputGroup>
            <Form.Control.Feedback type="invalid">
              {error && error.includes('Late Penalty Error') ? error.split('Late Penalty Error: ')[1] : ''}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            {isEditable ? (
              <>
                <Button variant="secondary" onClick={() => setIsEditable(false)} className="me-2">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditable(true)}>
                Update
              </Button>
            )}
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InsuranceSettingForm;
