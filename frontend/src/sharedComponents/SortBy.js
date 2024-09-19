import React, { useState, useEffect } from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const SortBy = ({ onSortChange, sortOptions = [], defaultSort }) => {
    const [selectedSort, setSelectedSort] = useState(defaultSort||  '');

    const handleSortChange = (sortBy) => {
        setSelectedSort(sortBy);
        onSortChange(sortBy);
    };

    useEffect(() => {
        setSelectedSort(defaultSort);
    }, [defaultSort]);

    return (
        <DropdownButton title={selectedSort  ||'Sort By'} variant="outline-secondary">
            {sortOptions.map((option, index) => (
                <Dropdown.Item key={index} onClick={() => handleSortChange(option.value)}>
                    {option.label}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
};

export default SortBy;