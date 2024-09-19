import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BackButton = ({ label = "Back", variant = "secondary", ...props }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1);
  };

  return (
    <Button variant={variant} onClick={handleClick} {...props}>
      {label}
    </Button>
  );
};

export default BackButton;
