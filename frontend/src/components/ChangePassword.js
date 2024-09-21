import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { changePassword } from '../services/AuthService'; 
import { successToast, errorToast } from '../sharedComponents/MyToast';
import { ToastContainer } from 'react-toastify';
import Header from './layout/Header';
import Footer from './layout/Footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BackButton from '../sharedComponents/BackButton';


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const navigate = useNavigate();

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      errorToast('New Password and Confirm Password do not match!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const changePasswordRequest = {
        currentPassword,
        newPassword,
        confirmPassword,
      };

      const response = await changePassword(token, changePasswordRequest); 
      successToast('Password changed successfully!');
      setTimeout(() => {
        navigate('/SecureLife.com/login'); 
      }, 500);
    } catch (error) {
      errorToast(error.specificMessage || 'Error changing password');
    }
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="justify-content-center">
          <Col md={4}>
            <Card className="p-4 shadow-lg m-5 " style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
              <Card.Body>
                <h3 className="text-center mb-4">Change Password</h3>
                <Form onSubmit={handleChangePassword}>
                <Form.Group controlId="currentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Row className="input-group d-flex">
                      <Col md={10} className="px-0">
                      <Form.Control
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                      />
                      </Col>
                      <Col md={2} className="px-0">
                      <Button variant="outline-secondary" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group controlId="newPassword" className="mt-3">
                    <Form.Label>New Password</Form.Label>
                    <Row className="input-group d-flex">
                    <Col md={10} className="px-0">
                    <Form.Control
                        type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    </Col>
                    <Col md={2} className="px-0">
                      <Button variant="outline-secondary" onClick={() => setShowNewPassword(!showNewPassword)}>
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Form.Group controlId="confirmPassword" className="mt-3">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Row className="input-group d-flex">
                    <Col md={10} className="px-0">
                    <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    </Col>
                    <Col md={2} className="px-0">
                      <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Row>
                    <Col md={7} className="px-0">
                    <Button type="submit" variant="primary" className="mt-4">
                    Change Password
                  </Button>
                    </Col>
                    <Col md={4} className="mt-4 px-0" style={{ textAlign: 'right' }}>
                    <BackButton/>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
      <Footer />
    </Container>
  );
};

export default ChangePassword;