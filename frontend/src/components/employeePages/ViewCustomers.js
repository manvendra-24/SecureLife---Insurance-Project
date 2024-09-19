import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { verifyEmployee } from '../../services/AuthService';
import { getAllCustomers, toggleCustomerStatus, getCustomerDocuments } from '../../services/EmployeeService';

import SearchBar from '../../sharedComponents/SearchBar';
import Pagination from '../../sharedComponents/Pagination';
import PageSize from '../../sharedComponents/PageSize';
import TableData from '../../sharedComponents/TableData';
import PageDropdown from '../../sharedComponents/PageDropDown';
import BackButton from '../../sharedComponents/BackButton';
import Loader from '../../sharedComponents/Loader';
import { successToast, errorToast } from '../../sharedComponents/MyToast';

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import NewButton from '../../sharedComponents/NewButton';

const ViewCustomers = () => {
  const [isEmployee, setIsEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(0);
  const [sortBy, setSortBy] = useState('');  
  const [direction, setDirection] = useState('');  

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('searchQuery') || '';
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;
  const size = parseInt(searchParams.get('size'), 10) || 5;

  useEffect(() => {
    const checkEmployeeStatus = async () => {
      try {
        const isEmployee = await verifyEmployee();
        setIsEmployee(isEmployee);
        if (!isEmployee) {
          navigate('/SecureLife.com/login');
        }
      } catch (error) {
        console.error('Error during employee verification:', error);
        navigate('/SecureLife.com/login');
      }
    };

    checkEmployeeStatus();
  }, [navigate]);

  const fetchData = useCallback(() => {
    const params = {
      searchQuery,
      page: currentPage - 1,
      size,
      sortBy,
      direction,
    };

    getAllCustomers(params)
      .then((responseData) => {
        setData(responseData.content);
        setNoOfPages(responseData.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the customers!', error);
        setError('Error in getting customers');
        setLoading(false);
      });
  }, [searchQuery, currentPage, size, sortBy, direction]);

  useEffect(() => {
    if (isEmployee !== null) {
      fetchData();
    }
  }, [fetchData, isEmployee]);

  const handleSearch = (newSearchQuery) => {
    setLoading(true);
    setSearchParams({
      searchQuery: newSearchQuery,
      page: currentPage,
      size,
      sortBy,
      direction,
    });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setLoading(true);
    setSearchParams({
      searchQuery,
      page: currentPage,
      size,
      sortBy: newSortBy,
      direction,
    });
  };

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
    setLoading(true);
    setSearchParams({
      searchQuery,
      page: currentPage,
      size,
      sortBy,
      direction: newDirection,
    });
  };

  const handleReset = () => {
    setSortBy('');
    setDirection('');
    setSearchParams({
      searchQuery: '',
      page: 1,
      size: 5,
      sortBy: '',
      direction: '',
    });
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setSearchParams({
      searchQuery,
      page,
      size,
      sortBy,
      direction,
    });
  };

  const handleSizeChange = (newSize) => {
    setLoading(true);
    setSearchParams({
      searchQuery,
      page: 1,
      size: newSize,
      sortBy,
      direction,
    });
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      await toggleCustomerStatus(customerId, !currentStatus);
      successToast(`Customer has been ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchData();
    } catch (error) {
      errorToast('Error toggling customer status');
    }
  };

  const handleViewDocuments = async (customerId) => {
    try {
      const documents = await getCustomerDocuments(customerId);
      navigate(`/SecureLife.com/employee/customers/${customerId}/documents`, { state: { documents, customerId } });
    } catch (error) {
      errorToast('Failed to fetch customer documents');
    }
  };

  const handleEdit = (customerId) => {
    navigate(`/SecureLife.com/employee/customers/${customerId}/update`);
  };

  if (loading) {
    return <Loader />;
  }



  const sortOptions = [
    { label: 'Customer ID', value: 'customerId' },
    { label: 'Name', value: 'name' },
  ];

  const handleAdd = () => {
    navigate('/SecureLife.com/register');
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header/>
      <Container fluid className="px-5 py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="m-5">
          <Col md={8}>
            <h2>Customers Data</h2> 
          </Col>
          <Col md={4} style={{ textAlign: 'right' }}>
            <NewButton text={"Add New Customer"} handleButton={handleAdd} /> 
          </Col>
        </Row>          
        <Row className="m-5">
            <Col md={2} className='mb-3'>
              <DropdownButton title={sortBy ? sortBy : "Sort By"} variant="outline-secondary">
                {sortOptions.map(option => (
                  <Dropdown.Item key={option.value} onClick={() => handleSortChange(option.value)}>
                    {option.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col md={1} className='mb-3'>
              <DropdownButton title={direction ? direction : "Direction"} variant="outline-secondary">
                <Dropdown.Item onClick={() => handleDirectionChange('asc')}>Asc</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDirectionChange('desc')}>Desc</Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col md={4}>
              <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
            </Col>
            <Col md={2} className='mb-3'>
              <Button variant="secondary" onClick={handleReset}>Reset</Button>
            </Col>
            <Col md={3} className="d-flex justify-content-end">
              <PageDropdown noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
              <PageSize size={size} setSize={handleSizeChange} />
            </Col>
          </Row>
          {data.length > 0 && (
            <Row className="m-5">
              <TableData
                data={data}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                customActionButton={(customerId) => (
                  <Button variant="warning" onClick={() => handleViewDocuments(customerId)}>
                    View Documents
                  </Button>
                )}
                isCustomerTable={true}
              />
            </Row>
          )}
          <Row className="m-5">
            <Col md={6}>
              <Pagination noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
            </Col>
            <Col md={6} style={{ textAlign: 'right' }}>
              <BackButton />
            </Col>
          </Row>
        </Container>
      <Footer />
    </Container>
  );
};

export default ViewCustomers;
