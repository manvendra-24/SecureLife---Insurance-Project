import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, InputGroup } from 'react-bootstrap';
import { isInRange} from '../../../utils/helpers/Validation';
import { FaPercent } from 'react-icons/fa'; 

const InsuranceSettingForm = ({ show, handleClose, handleSave, initialClaimDeduction, initialWithdrawalPenalty, initialLatePenalty }) => {
  const [claimDeduction, setClaimDeduction] = useState('');
  const [withdrawalPenalty, setWithdrawalPenalty] = useState('');
  const [latePenalty, setLatePenalty] = useState('');
  const [errors, setErrors] = useState({});
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

    const claimDeductionError = isInRange(claimDeductionValue, 0, 20);
    const withdrawalPenaltyError = isInRange(withdrawalPenaltyValue, 0, 50);
    const latePenaltyError = isInRange(latePenaltyValue, 0, 20);

    const newErrors = {
      claimDeduction: claimDeductionError,
      withdrawalPenalty: withdrawalPenaltyError,
      latePenalty: latePenaltyError
    };

    if (claimDeductionError || withdrawalPenaltyError || latePenaltyError) {
      setErrors(newErrors);
    } else {
      setErrors({});
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
                isInvalid={!!errors.claimDeduction}
                disabled={!isEditable}
              />
              <InputGroup.Text>
                <FaPercent /> 
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {errors.claimDeduction}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formWithdrawalPenalty">
            <Form.Label>Withdrawal Penalty</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter withdrawal penalty"
                value={withdrawalPenalty}
                onChange={(e) => setWithdrawalPenalty(e.target.value)}
                isInvalid={!!errors.withdrawalPenalty}
                disabled={!isEditable}
              />
              <InputGroup.Text>
                <FaPercent /> 
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {errors.withdrawalPenalty}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="formLatePenalty">
            <Form.Label>Late Penalty</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder="Enter late penalty"
                value={latePenalty}
                onChange={(e) => setLatePenalty(e.target.value)}
                isInvalid={!!errors.latePenalty}
                disabled={!isEditable}
              />
              <InputGroup.Text>
                <FaPercent /> 
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {errors.latePenalty}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Buttons */}
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
