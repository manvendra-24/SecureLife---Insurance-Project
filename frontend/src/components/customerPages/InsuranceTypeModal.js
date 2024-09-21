import React, { useEffect, useState } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getAllInsuranceTypes } from '../../services/CustomerService';

const InsuranceTypesModal = ({ show, handleClose }) => {
  const [insuranceTypes, setInsuranceTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInsuranceTypes = async () => {
      try {
        const response = await getAllInsuranceTypes();
        setInsuranceTypes(response.content || []);
      } catch (error) {
        console.error('Error fetching insurance types:', error);
      }
    };

    if (show) fetchInsuranceTypes();
  }, [show]);

  const handleTypeClick = (insuranceTypeId) => {
    handleClose();
    navigate(`/SecureLife.com/user/types/${insuranceTypeId}`);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Insurance Types</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {insuranceTypes.length > 0 ? (
          <ListGroup>
            {insuranceTypes.map((type) => (
              <ListGroup.Item
                key={type.insuranceTypeId}
                action
                onClick={() => handleTypeClick(type.insuranceTypeId)}
              >
                {type.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p>No Insurance Types Available</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InsuranceTypesModal;
