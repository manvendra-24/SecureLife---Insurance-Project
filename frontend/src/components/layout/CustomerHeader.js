import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

import { getAllInsuranceTypes } from '../../services/CustomerService';

const CustomerHeader = () => {
  const navigate = useNavigate();
  const [insuranceTypes, setInsuranceTypes] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/SecureLife.com/login');
  };

  const handleProfile = () => {
    navigate('/SecureLife.com/user/profile');
  };

  useEffect(() => {
    const fetchInsuranceTypes = async () => {
      try {
        const response = await getAllInsuranceTypes();
        setInsuranceTypes(response.content || []); 
      } catch (error) {
        console.error('Error fetching insurance types:', error);
      }
    };

    fetchInsuranceTypes();
  }, []);

  return (
    <Navbar className="shadow-sm" style={{ backgroundColor: 'rgba(193, 220, 220, 0.5)' }}>
      <Container>
        <Navbar.Brand href="/" className="font-weight-bold text-primary">
          SecureLife
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            <NavDropdown title="Insurance Scheme" id="insurance-scheme-dropdown">
              {insuranceTypes.length > 0 ? (
                insuranceTypes.map((type) => (
                  <NavDropdown.Item
                    key={type.insuranceTypeId}
                    onClick={() => navigate(`/SecureLife.com/user/types/${type.insuranceTypeId}`)}
                  >
                    {type.name}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item>No Insurance Types Available</NavDropdown.Item>
              )}
            </NavDropdown>
            <Nav.Link onClick={handleProfile}>
              <FaUserCircle className="mr-1" /> Profile
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>
              <FaSignOutAlt className="mr-1" /> Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomerHeader;