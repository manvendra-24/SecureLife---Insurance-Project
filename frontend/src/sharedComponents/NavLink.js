import React from 'react';
import { Nav } from 'react-bootstrap';

const NavLink = ({ onClick, icon: Icon, text, disabled }) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
    } else {
      onClick();
    }
  };

  return (
    <Nav.Link
      onClick={handleClick}
      className={`d-flex align-items-center ${disabled ? 'text-muted' : 'text-dark'}`}
      style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
    >
      {Icon && <Icon className="mr-2" />}
      {text}
    </Nav.Link>
  );
};

export default NavLink;
