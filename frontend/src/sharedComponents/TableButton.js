import React from 'react';
import { Button } from 'react-bootstrap';

const TableButton = ({ onClick, variant, text , disabled}) => {
    return (
        <Button
            onClick={onClick}
            variant={variant}
            style={{
                padding: '8px 16px',
                fontSize: '16px',
                marginLeft: '10px',
                borderRadius: '4px',
                border: '1px solid #ccc'
            }}
            disabled={disabled}
        >
            {text}
        </Button>
    );
};

export default TableButton;
