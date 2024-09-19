import React from 'react';
import { Nav } from 'react-bootstrap';

const NavLink = ({ onClick, icon: Icon, text }) => {
  return (
    <Nav.Link 
      onClick={onClick} 
      className="d-flex align-items-center text-dark" 
      style={{ cursor: 'pointer' }}
    >
      {Icon && <Icon className="mr-2" />}
      {text}
    </Nav.Link>
  );
};

export default NavLink;
