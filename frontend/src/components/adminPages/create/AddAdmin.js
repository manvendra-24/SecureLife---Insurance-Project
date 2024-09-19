import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { required, isEmail, isAlphaNumNoSpace, checkSize, onlyPositive } from '../../../utils/helpers/Validation';

const AddAdmin = ({ show, handleClose, handleSave }) => {
  const [adminData, setAdminData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    tempErrors.name = required(adminData.name) || checkSize(adminData.name, 2, 100);
    tempErrors.username = required(adminData.username) || checkSize(adminData.username, 4, 50) || isAlphaNumNoSpace(adminData.username);
    tempErrors.email = required(adminData.email) || isEmail(adminData.email);
    tempErrors.password = required(adminData.password) || checkSize(adminData.password, 8, 100);
    tempErrors.phoneNumber = required(adminData.phoneNumber) || onlyPositive(adminData.phoneNumber) || checkSize(adminData.phoneNumber, 10, 10);

    setErrors(tempErrors);

    return Object.values(tempErrors).every(x => x === undefined);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSave(adminData);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Admin</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              name="name"
              value={adminData.name}
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
              value={adminData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              value={adminData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              name="password"
              value={adminData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formPhoneNumber">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              name="phoneNumber"
              value={adminData.phoneNumber}
              onChange={handleChange}
              isInvalid={!!errors.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-5">
            Create Admin
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAdmin;
