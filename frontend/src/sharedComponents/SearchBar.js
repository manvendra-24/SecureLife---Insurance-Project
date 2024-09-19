import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';

const SearchBar = ({ onSearch, defaultValue }) => {
    const [searchQuery, setSearchQuery] = useState(defaultValue);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearch(searchQuery);
    };

    useEffect(() => {
        setSearchQuery(defaultValue);
    }, [defaultValue]);

    return (
        <Form onSubmit={handleSearchSubmit} className="d-flex justify-content-end mb-3">
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="me-2"
                />
                <Button type="submit" variant="primary">
                    Search
                </Button>
                
            </InputGroup>
        </Form>
    );
};

export default SearchBar;