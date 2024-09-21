import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';

import { loginService } from '../services/AuthService';

import { successToast, errorToast } from '../sharedComponents/MyToast';
import { ToastContainer } from 'react-toastify';
import Header from './layout/Header';
import Footer from './layout/Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = await loginService(email, password);
      if (data.role === 'ROLE_ADMIN') {
        successToast('Logged in successfully!');
        setTimeout (()=>{
          navigate(`/SecureLife.com/admin/dashboard`);
        },500);
      } 
      else if (data.role === 'ROLE_CUSTOMER') {
        successToast('Logged in successfully!');
        setTimeout(() => {
          navigate('/SecureLife.com/customer/dashboard');
        }, 500);
      } else if (data.role === 'ROLE_AGENT') {
        successToast('Logged in successfully!');
        setTimeout(() => {
          navigate('/SecureLife.com/agent/dashboard');
        }, 500);
      } else if (data.role === 'ROLE_EMPLOYEE') {
        successToast('Logged in successfully!');
        setTimeout(() => {
          navigate('/SecureLife.com/employee/dashboard');
        }, 500);
      }
      else{
        errorToast("Redirecting issue");
      }
    } catch(error){
      errorToast(error.specificMessage);
    }
  };


  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0"  >
      <Header/>
      <Container fluid className="py-5" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
        <Row>
          <Col md={8} className="px-0 d-flex align-items-center justify-content-center">
            <div className="text-center">
              <h1 className="display-4">SecureLife</h1>
              <p className="lead">Your trusted partner for securing your future.</p>
            </div>
          </Col>
          <Col md={4} className="px-0 align-items-center justify-content-center">
          <Col md={8}>
            <Card className="p-4 shadow-lg" style={{ backgroundColor: 'rgba(230, 242, 255, 0.85)' }}>
              <Card.Body>
                <h3 className="text-center mb-4">Login</h3>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="email">
                    <Form.Label >Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your Username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between mb-3">
                    <Link to="/SecureLife.com/password" className="text-primary text-decoration-none">
                      Forgot Password?
                    </Link>
                  </div>

                  <Button type="submit" variant="primary" className="w-100">
                    Login
                  </Button>
                </Form>
                <div className="text-center">
                <span>New User? </span>
                <Link to="/SecureLife.com/register" className="text-decoration-none">
                  Register here
                </Link>
              </div>
              </Card.Body>
            </Card>
          </Col>
          </Col>
        </Row>
      </Container>
      <ToastContainer />
      <Footer/>
    </Container>
  );
};

export default Login;
