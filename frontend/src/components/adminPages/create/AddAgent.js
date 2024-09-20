import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { required, isEmail, checkSize, onlyPositive, isAlphaNumNoSpace, isTenDigits } from '../../../utils/helpers/Validation';

const AddAgent = ({ show, handleClose, handleSave }) => {
  const [agentData, setAgentData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    address: '',
    name: '',
    city_id: '',
  });

  const [errors, setErrors] = useState({});

  const validate = (data) => {
    let tempErrors = {};
    tempErrors.username = required(data.username) || isAlphaNumNoSpace(data.username) || checkSize(data.username, 4, 50);
    tempErrors.password = required(data.password) || checkSize(data.password, 8, 20);
    tempErrors.email = required(data.email) || isEmail(data.email);
    tempErrors.phoneNumber = required(data.phoneNumber) || isTenDigits(data.phoneNumber) || onlyPositive(data.phoneNumber);
    tempErrors.address = required(data.address) || checkSize(data.address, 0, 255);
    tempErrors.name = required(data.name) || checkSize(data.name, 2, 100);
    tempErrors.city_id = required(data.city_id) || isAlphaNumNoSpace(data.city_id);

    setErrors(tempErrors);
    return Object.values(tempErrors).every(x => x === undefined || x === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgentData({
      ...agentData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate(agentData)) {
      handleSave(agentData);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Agent</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={agentData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              name="username"
              value={agentData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={agentData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={agentData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={agentData.phoneNumber}
              onChange={handleChange}
              isInvalid={!!errors.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter address"
              name="address"
              value={agentData.address}
              onChange={handleChange}
              isInvalid={!!errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {errors.address}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formCityId">
            <Form.Label>City ID</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city ID"
              name="city_id"
              value={agentData.city_id}
              onChange={handleChange}
              isInvalid={!!errors.city_id}
            />
            <Form.Control.Feedback type="invalid">
              {errors.city_id}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Add Agent
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAgent;