import React, { useEffect, useState } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';

import jsPDF from 'jspdf';  
import 'jspdf-autotable';   

import { verifyAdmin } from '../../../services/AuthService';
import { getAllAgents, activateAgent, deactivateAgent, registerAgent } from '../../../services/AdminService';

import SearchBar from '../../../sharedComponents/SearchBar';
import Pagination from '../../../sharedComponents/Pagination';
import PageSize from '../../../sharedComponents/PageSize';
import TableData from '../../../sharedComponents/TableData2';
import PageDropdown from '../../../sharedComponents/PageDropDown';
import NewToast,{ showToast } from '../../../sharedComponents/NewToast';
import BackButton from '../../../sharedComponents/BackButton';
import Loader from '../../../sharedComponents/Loader';

import AddAgent from '../create/AddAgent';

import Header from '../../layout/Header';
import Footer from '../../layout/Footer';

import sanitizeData from '../../../utils/helpers/SanitizedData';
import NewButton from '../../../sharedComponents/NewButton';

const ViewAgent = () => {
  const [showModal, setShowModal] = useState(false);
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

      const responseData = await getAllAgents(params);
      const sanitizedData = sanitizeData(responseData.content);
      setData(sanitizedData);
      setNoOfPages(responseData.totalPages);
    } catch (error) {
      showToast('Error in Fetching Agents', 'error');
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

  const activeAgent = async (id) => {
    console.log(id);
    try {
      await activateAgent(id);
      showToast('Agent Activated successfully', 'success');
      setTimeout(()=>{
        fetchData();
      },1000); 
    } catch (error) {
      showToast('Error in activating agent','error');
    }
  };

  const deleteAgent = async (id) => {
    console.log(id);
    try {
      await deactivateAgent(id);
      showToast('Agent Deactivated successfully', 'success');
      setTimeout(()=>{
        fetchData();
      },1000);    
    } catch (error) {
      showToast('Error in deactivating Agent','error');
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
  };

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
  };

  const sortOptions = [
    { label: 'Agent ID', value: 'agentId' },
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

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSaveAgent = async (formData) => {
    setLoading(true);
    try {
      await registerAgent(formData);
      setLoading(false);
      showToast('Agent registered successfully', 'success');
      setTimeout(()=>{
        handleCloseModal();
        fetchData();
      },500)  
    } catch (error) {
      setLoading(false);
      showToast('Error registering agent', 'error');
    }
  };

  
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
  

  return (
    <Container fluid className="bg-light text-dark d-flex flex-column min-vh-100 px-0">
      <Header/>
      <AddAgent show={showModal} handleClose={handleCloseModal} handleSave={handleSaveAgent} />
        <Container fluid className="py-5" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
          <Row className="m-5">
            <Col md={8}>
              <h2>Agents Data</h2>
            </Col>
            <Col md={4} style={{textAlign:'right'}}>
              <Button variant="success" className="me-3" onClick={downloadPDF}>Download PDF</Button> 
              <NewButton text={"Add New Agent"} handleButton={handleShowModal}/>
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
                <TableData data={data} fetchData={fetchData} status={"Agent"} activateRow={activeAgent} deactivateRow={deleteAgent} />
              </Row>
              <Row className="m-5">
                <Col md={6}>
                  <Pagination noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
                </Col>
                <Col md={6} style={{textAlign:'right'}}>
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

export default ViewAgent;
