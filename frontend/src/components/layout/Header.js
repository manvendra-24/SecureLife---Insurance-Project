import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

import NavLink from '../../sharedComponents/NavLink';
import { showToast } from '../../sharedComponents/NewToast';

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    if(localStorage.getItem('token')){
      localStorage.removeItem('token');
      showToast('Logout successfully','success');
      setTimeout(()=>{
        navigate('/SecureLife.com/login');
      },500)
    }
  };

  const handleProfile = () =>{
    if(localStorage.getItem('token')){
      navigate('/SecureLife.com/user/profile');
    }
  }


  return (
    <Navbar className="shadow-sm" style={{backgroundColor:'rgba(193, 220, 220, 0.5)'}}>
      <Container>
        <Navbar.Brand href='/' className="font-weight-bold text-primary">
          SecureLife
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="ml-auto">
            <NavLink onClick={handleProfile} icon={FaUserCircle} text="Profile" disabled={!token}/>
            <NavLink onClick={handleLogout} icon={FaSignOutAlt} text="Logout" disabled={!token}/>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
