import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import PasswordService from '../services/PasswordService';
import { successToast, errorToast } from '../sharedComponents/MyToast';
import { ToastContainer } from 'react-toastify';
import Header from './layout/Header';
import Footer from './layout/Footer';

const PasswordResetFlow = () => {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); 
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (step === 'verify') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleRequestOtp = async (event) => {
    event.preventDefault();
    try {
      await PasswordService.requestOtp(email);
      successToast('OTP sent successfully!');
      setStep('verify');
    } catch (error) {
      errorToast(error.message);
    }
  };

  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 3) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (timeLeft === 0) {
      errorToast('OTP has expired, please request a new one.');
      return;
    }
    try {
      await PasswordService.verifyOtp(otp.join(''));
      successToast('OTP verified successfully!');
      setStep('reset');
    } catch (error) {
      errorToast(error.message);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      errorToast('Passwords do not match');
      return;
    }
    try {
      await PasswordService.setNewPassword(email, newPassword, confirmPassword);
      successToast('Password reset successfully!');
      setTimeout(() => navigate('/SecureLife.com/login'), 3000);
    } catch (error) {
      errorToast(error.message);
    }
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 flex-grow-1" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row>
          <Col md={8} className="px-0 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <h1 className="display-4">SecureLife</h1>
              <p className="lead">Your trusted partner for securing your future.</p>
            </div>
          </Col>
          <Col md={4} className="px-0">
            <Col md={8}>
              <Card className="p-4 shadow-lg" style={{ backgroundColor: 'rgba(230, 242, 255, 0.85)' }}>
                <Card.Body>
                  {step === 'request' && (
                    <>
                      <h3 className="text-center mb-4">Request OTP</h3>
                      <Form onSubmit={handleRequestOtp}>
                        <Form.Group className="mb-3">
                          <Form.Label>Enter your registered email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ height: '40px', fontSize: '16px' }}
                          />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ width: '100%', padding: '10px 0', fontSize: '18px' }}>
                          Send OTP
                        </Button>
                      </Form>
                    </>
                  )}
                  {step === 'verify' && (
                  <>
                  <h3 className="text-center mb-4">Verify OTP</h3>
                  <p className="text-center" style={{ color: 'red' }}>Time left: {formatTime(timeLeft)}</p>
                    <Form onSubmit={handleVerifyOtp}>
                        <div className="d-flex justify-content-center mb-4">
                            {otp.map((_, index) => (
                              <Form.Control
                                key={index}
                                type="text"
                                value={otp[index]}
                                onChange={(e) => handleOtpChange(e.target, index)}
                                onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                ref={(el) => (otpRefs.current[index] = el)}
                                maxLength="1"
                                required
                                style={{ width: '50px', height: '50px', fontSize: '24px', textAlign: 'center', marginRight: index < 3 ? '10px' : '0' }}
                              />
                                  ))}
                        </div>
                        <Row className="justify-content-center">
                          <Col md="auto">
                            <Button type="submit" variant="primary">
                                    Verify OTP
                            </Button>
                          </Col>
                        </Row>
                    </Form>
                  </>
                      )}

                  {step === 'reset' && (
                    <>
                      <h3 className="text-center mb-4">Reset Password</h3>
                      <Form onSubmit={handleResetPassword}>
                        <Form.Group className="mb-3">
                          <Form.Label>New Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ height: '40px', fontSize: '16px' }}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Confirm Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ height: '40px', fontSize: '16px' }}
                          />
                        </Form.Group>
                        <Button type="submit" variant="primary" style={{ width: '100%', padding: '10px 0', fontSize: '18px' }}>
                          Reset Password
                        </Button>
                      </Form>
                    </>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
      <Footer />
    </Container>
  );
};

export default PasswordResetFlow;
