import React, { useEffect, useState } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

import jsPDF from 'jspdf';  
import 'jspdf-autotable';   

import { verifyAdmin } from '../../../services/AuthService'; 
import { getAllCustomers, activateCustomer, deactivateCustomer } from '../../../services/AdminService';

import SearchBar from '../../../sharedComponents/SearchBar';
import Pagination from '../../../sharedComponents/Pagination';
import PageSize from '../../../sharedComponents/PageSize';
import TableData from '../../../sharedComponents/TableData2';
import PageDropdown from '../../../sharedComponents/PageDropDown';
import NewToast, { showToast } from '../../../sharedComponents/NewToast';
import BackButton from '../../../sharedComponents/BackButton';
import Loader from '../../../sharedComponents/Loader';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import sanitizeData from '../../../utils/helpers/SanitizedData';
import NewButton from '../../../sharedComponents/NewButton';

const ViewCustomer = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(0);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('searchQuery') || '';
  const currentPage = parseInt(searchParams.get('page'), 10) || 1;
  const size = parseInt(searchParams.get('size'), 10) || 10;
  const sortBy = searchParams.get('sortBy') || '';
  const direction = searchParams.get('direction') || '';

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {
        searchQuery: searchQuery,
        page: currentPage - 1,
        size,
        sortBy,
        direction
      };

      const responseData = await getAllCustomers(params); 
      const sanitizedData = sanitizeData(responseData.content);
      setData(sanitizedData);
      setNoOfPages(responseData.totalPages);
    } catch (error) {
      showToast('Error in Fetching Customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdmin = await verifyAdmin();
        if (isAdmin) {
          setIsAdmin(true);
          fetchData(); 
        } else {
          showToast('Unauthorized Access! Please Login','error');
          setTimeout(() => {
            navigate('/SecureLife.com/login');
          }, 1000);
        }
      } catch (error) {
        showToast('Internal Server Error','error');
        setTimeout(() => {
          navigate('/SecureLife.com/login');
        }, 1000);          
      }
    };

    checkAdminStatus();
  }, [navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [searchQuery, currentPage, size, direction, sortBy, isAdmin]);

  if (isAdmin === null) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  const activeCustomer = async (id) => { 
    try {
      await activateCustomer(id); 
      showToast('Customer Activated successfully', 'success');
      setTimeout(()=>{
        fetchData();
      },1000);     
    } catch (error) {
      showToast('Error in activating customer','error'); 
    }
  };

  const deleteCustomer = async (id) => { 
    try {
      await deactivateCustomer(id); 
      showToast('Customer Deactivated successfully', 'success');
      setTimeout(()=>{
        fetchData();
      },1000);     
    } catch (error) {
      showToast('Error in deactivating customer','error');
    }
  };

  const handleSearch = (newSearchQuery) => {
    if (newSearchQuery !== searchQuery) {
      setLoading(true);
      setSearchParams({
        searchQuery: newSearchQuery,
        page: 1,
        size,
        direction,
        sortBy
      });
    }
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setSearchParams({
      searchQuery,
      page,
      size,
      direction,
      sortBy
    });
  };

  const handleSizeChange = (newSize) => {
    setLoading(true);
    setSearchParams({
      searchQuery,
      page: 1,
      size: newSize,
      direction,
      sortBy
    });
  };

  const handleSortChange = (newSort) =>{
    if(sortBy !== newSort){
      setLoading(true);
      setSearchParams({
        searchQuery,
        page: 1,
        size,
        sortBy:newSort,
        direction
      });
    } 
  }

  const handleDirectionChange = (newDirection) => {
    if(direction !== newDirection){
      setLoading(true);
      setSearchParams({
        searchQuery,
        page: 1,
        size,
        sortBy,
        direction:newDirection
      });  
    }
  }

  const sortOptions = [
    { label: 'Customer ID', value: 'customerId' },
    { label: 'Name', value: 'name' },
  ];

  const handleReset = () => {
    setSearchParams({
      searchQuery: '',
      page: 1,
      size: 10,
      sortBy: '',
      direction: '',
    });
  };

  const handleAdd = () => {
    navigate('/SecureLife.com/register');
  };


  const downloadPDF = () => {
    const doc = new jsPDF();

  
    doc.text('Customer Report', 14, 16);

    
    doc.autoTable({
      startY: 22,
      head: [['Customer ID', 'Name', 'Email', 'Status', 'Active']],
      body: data.map(customer => [
        customer.customerId,
        customer.name,
        customer.email,
        customer.status,
        customer.active ? 'YES' : 'NO',
      ]),
      columnStyles: {
        0: { cellWidth: 30 }, 
        1: { cellWidth: 40 },  
        2: { cellWidth: 60 },  
        3: { cellWidth: 25 }, 
        4: { cellWidth: 15 },  
      },
      styles: {
        fontSize: 9,  
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185], 
        textColor: [255, 255, 255], 
      },
      theme: 'grid',
    });

    
    doc.save('Customer_Report.pdf');
  };

  return (
    <Container fluid className="bg-light text-dark d-flex flex-column min-vh-100 px-0">
      <Header/>
      <Container fluid className="py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="m-5">
          <Col md={8}>
            <h2>Customers Data</h2> 
          </Col>
          <Col md={4} style={{ textAlign: 'right' }}>
            <Button variant="success" className="me-3" onClick={downloadPDF}>Download PDF</Button> {/* Add PDF Button */}
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
            <Col md={4} className="page-size-container-center">
              <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
            </Col>
            <Col md={1} className='mb-3'>
              <Button variant="secondary" onClick={handleReset}>Reset</Button>
            </Col>
          <Col md={4} className="page-size-container-right d-flex justify-content-end">
            <PageDropdown noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
            <PageSize size={size} setSize={handleSizeChange} />
          </Col>
        </Row>
        <div>
          <Row className="m-5">                
            <TableData data={data} fetchData={fetchData} status={"Customer"} activateRow={activeCustomer} deactivateRow={deleteCustomer} />
          </Row>
          <Row className="m-5">
            <Col md={6}>
              <Pagination noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
            </Col>
            <Col md={6} style={{ textAlign: 'right' }}>
              <BackButton />
            </Col>
          </Row>
        </div>
      </Container>
      <Footer />
      <NewToast />
    </Container>
  );
};

export default ViewCustomer;
