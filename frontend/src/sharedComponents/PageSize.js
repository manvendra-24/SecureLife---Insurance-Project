import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const PageSize = ({ size, setSize }) => {
    const handleChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setSize(value);
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <InputGroup>
                <InputGroup.Text style={{ marginRight: '0.5rem' }}>Size:</InputGroup.Text>
                <Form.Control
                    type="number"
                    id="pageSize"
                    style={{
                        width: '80px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem'
                    }}
                    value={size}
                    onChange={handleChange}
                    min="1"
                />
            </InputGroup>
        </div>
    );
};

export default PageSize;