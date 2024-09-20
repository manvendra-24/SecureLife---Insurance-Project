import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const PageSize = ({ size, setSize }) => {
    const handleChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setSize(value);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <InputGroup>
                <InputGroup.Text style={{ marginRight: '0.5rem' }}>Size:</InputGroup.Text>
                <Form.Select
                    id="pageSize"
                    style={{
                        width: '80px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem'
                    }}
                    value={size}
                    onChange={handleChange}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                    <option value={25}>25</option>
                </Form.Select>
            </InputGroup>
        </div>
    );
};

export default PageSize;
