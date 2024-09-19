import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="py-4 mt-auto" style={{backgroundColor:'rgba(179, 201, 201, 0.5)'}}>
      <Container>
        <Row>
          <Col md={4}>
            <h5>SecureLife.com</h5>
            <p>Providing trusted life insurance plans for you and your loved ones.</p>
          </Col>
          <Col md={2}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-decoration-none">Home</Link></li>
              <li><Link to="/about" className="text-decoration-none">About Us</Link></li>
              <li><Link to="/policies" className="text-decoration-none">Policies</Link></li>
              <li><Link to="/contact" className="text-decoration-none">Contact</Link></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Contact Us</h5>
            <p>Email: <a href="mailto:support@securelife.com" className="text-decoration-none">support@securelife.com</a></p>
            <p>Phone: <a href="tel:+18001234567" className="text-decoration-none">+1 (800) 123-4567</a></p>
            <p>Address: 123 Secure Street, Safe City, Protected Country</p>
          </Col>
          <Col md={3}>
            <h5>Follow Us</h5>
            <div className="d-flex">
              <a href="#" target="_blank" rel="noopener noreferrer" className="me-3"><FaFacebookF /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="me-3"><FaTwitter /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="me-3"><FaLinkedinIn /></a>
              <a href="#" target="_blank" rel="noopener noreferrer" className=""><FaInstagram /></a>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">&copy; 2024 SecureLife.com. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
