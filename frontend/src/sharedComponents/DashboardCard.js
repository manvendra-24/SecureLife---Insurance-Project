import React from 'react';
import { Col, Card } from 'react-bootstrap';

import NewButton from './NewButton';

const DashboardCard = ({ title, text, handleButton, buttonText, height }) => {
  return (
    <Card
    style={{
      height: height || 'auto',
      backgroundColor: 'rgba(230, 242, 255, 0.35)'
    }}
  >
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{text}</Card.Text>
      <NewButton handleButton={handleButton} text={buttonText} />
    </Card.Body>
  </Card>
  
  );
};

export default DashboardCard;
