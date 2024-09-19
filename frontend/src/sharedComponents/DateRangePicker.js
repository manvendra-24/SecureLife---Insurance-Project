import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate, onSearch }) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate);

  useEffect(() => {
    setLocalStartDate(startDate);
  }, [startDate]);

  useEffect(() => {
    setLocalEndDate(endDate);
  }, [endDate]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setLocalStartDate(newStartDate);
    if (localEndDate && newStartDate && newStartDate > localEndDate) {
      setLocalEndDate('');
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setLocalEndDate(newEndDate);
  };

  const handleSearchClick = () => {
    setStartDate(localStartDate); 
    setEndDate(localEndDate);  
    onSearch(localStartDate, localEndDate);
  };

  const handleResetClick = () => {
    setLocalStartDate('');
    setLocalEndDate('');
    if (startDate === '' && endDate === '') {
      return;
    }
    setStartDate('');
    setEndDate('');
    onSearch('', '');
  };

  return (
    <Form>
      <Row>
        <Col md={4}>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={localStartDate}
              onChange={handleStartDateChange}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={localEndDate}
              onChange={handleEndDateChange}
              min={localStartDate}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="d-flex align-items-end">
          <Button variant="primary" onClick={handleSearchClick} className="me-2">
            Search
          </Button>
          <Button variant="secondary" onClick={handleResetClick}>
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default DateRangePicker;