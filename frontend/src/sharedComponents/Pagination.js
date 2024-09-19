import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const CustomPagination = ({ noOfPages, currentPage, setPageNo }) => {
    const handlePageChange = (page) => {
        if (page >= 1 && page <= noOfPages) {
            setPageNo(page);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        if (noOfPages <= 1) return pages;

        if (currentPage > 1) {
            pages.push(currentPage - 1);
        }

        pages.push(currentPage);

        if (currentPage < noOfPages) {
            pages.push(currentPage + 1);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <Pagination>
            <Pagination.Prev 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            />
            {pageNumbers.map(p => (
                <Pagination.Item 
                    key={p} 
                    active={p === currentPage} 
                    onClick={() => handlePageChange(p)}
                >
                    {p}
                </Pagination.Item>
            ))}
            <Pagination.Next 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === noOfPages}
            />
        </Pagination>
    );
};

export default CustomPagination;
