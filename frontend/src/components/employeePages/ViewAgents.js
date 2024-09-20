import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

import { verifyEmployee } from '../../services/AuthService';
import { getAllAgents, toggleAgentStatus } from '../../services/EmployeeService';

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

const ViewAgentsTable = () => {
  const [isEmployee, setIsEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
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

    getAllAgents(params)
      .then((responseData) => {
        setData(responseData.content);
        setNoOfPages(responseData.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the agents!', error);
        setLoading(false);
      });
  }, [searchQuery, currentPage, size, sortBy, direction]);

  useEffect(() => {
    if (isEmployee !== null) {
      fetchData();
    }
  }, [fetchData, isEmployee]);

  
  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text('Agent Report', 14, 16);
  
    
    doc.autoTable({
      startY: 22,
      head: [['Agent ID', 'Name', 'Username', 'Address', 'Active', 'Email']],
      body: data.map(agent => [
        agent.agentId,
        agent.name,
        agent.username,
        agent.address,
        agent.active ? 'YES' : 'NO',
        agent.email,
      ]),
      columnStyles: {
        0: { cellWidth: 25 },  
        1: { cellWidth: 30 },  
        2: { cellWidth: 25 },  
        3: { cellWidth: 45 },  
        4: { cellWidth: 20 },  
        5: { cellWidth: 50 }, 
      },
      styles: {
        fontSize: 9,  
        cellPadding: 3,  
      },
      headStyles: {
        fillColor: [41, 128, 185], 
        textColor: [255, 255, 255], 
      },
      theme: 'grid',  
    });
  
  
    doc.save('Agent_Report.pdf');
  };
  
  

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

  const handleToggleStatus = async (agentId, currentStatus) => {
    try {
      await toggleAgentStatus(agentId, !currentStatus);
      successToast(`Agent has been ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      fetchData();
    } catch (error) {
      errorToast('Error toggling agent status');
    }
  };

  const handleEdit = (agentId) => {
    navigate(`/SecureLife.com/employee/agents/${agentId}/update`);
  };

  if (loading) {
    return <Loader />;
  }

  const sortOptions = [
    { label: 'Agent ID', value: 'agentId' },
    { label: 'Name', value: 'name' },
  ];

  return (
    <Container fluid className="px-0 d-flex flex-column min-vh-100">
      <Header role="employee" />
      
      <div className="content-container flex-grow-1">
        <Container className="mt-5">
          <Row className="mb-3 align-items-center">
            <Col md={8}>
              <h2>Agents Data</h2>
            </Col>
            <Col md={4} style={{ textAlign: 'right' }}> {/* Top right corner */}
              <Button variant="success" onClick={downloadPDF}>Download PDF</Button>
            </Col>
          </Row>
          <Row className="mb-3 align-items-center">
            <Col md={1} className='mb-3'>
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
            <Col md={4} className="d-flex justify-content-end">
              <PageDropdown noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
              <PageSize size={size} setSize={handleSizeChange} />
            </Col>
          </Row>
          <Row>
            {data.length > 0 && (
              <TableData
                data={data}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
              />
            )}
          </Row>
          <Row>
            <Col md={6}>
              <Pagination noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
            </Col>
            <Col md={6} style={{ textAlign: 'right' }}>
              <BackButton />
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </Container>
  );
};

export default ViewAgentsTable;
