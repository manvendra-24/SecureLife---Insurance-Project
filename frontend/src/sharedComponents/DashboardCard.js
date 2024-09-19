import React from 'react';
import { Card } from 'react-bootstrap';
import NewButton from './NewButton';

const DashboardCard = ({ icon, title, text, handleButton, buttonText, height }) => {
  return (
    <Card
      className="text-center p-4 shadow-sm"
      style={{
        height: height || 'auto',
        backgroundColor: 'rgba(230, 242, 255, 0.35)',
        borderRadius: '12px',
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <Card.Body className="d-flex flex-column align-items-center justify-content-center">
        {icon && (
          <div className="mb-4" style={{ fontSize: '3rem', color: '#007bff' }}>
            {icon}
          </div>
        )}
        <Card.Title style={{ fontSize: '1.5rem', fontWeight: '600' }}>{title}</Card.Title>
        <Card.Text style={{ fontSize: '1rem', color: '#555', marginBottom: '20px' }}>{text}</Card.Text>
        <NewButton handleButton={handleButton} text={buttonText} />
      </Card.Body>
    </Card>
  );
};

export default DashboardCard;
