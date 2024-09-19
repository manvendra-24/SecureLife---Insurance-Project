import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

const PageDropdown = ({ noOfPages, currentPage, setPageNo }) => {
    const pageNumbers = Array.from({ length: noOfPages }, (_, i) => i + 1);

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <InputGroup>
                <InputGroup.Text style={{ marginRight: '0.5rem' }}>Page:</InputGroup.Text>
                <Form.Select 
                    value={currentPage}
                    onChange={(e) => setPageNo(Number(e.target.value))}
                    style={{
                        width: '80px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.875rem'
                    }}
                >
                    {pageNumbers.map((page) => (
                        <option key={page} value={page}>{page}</option>
                    ))}
                </Form.Select>
            </InputGroup>
        </div>
    );
};

export default PageDropdown;