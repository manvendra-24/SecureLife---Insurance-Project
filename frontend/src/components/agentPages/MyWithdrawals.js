import React, {useState, useEffect} from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import {Container, Row, Col, DropdownButton, Dropdown, Button} from 'react-bootstrap';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

import SearchBar from '../../sharedComponents/SearchBar';
import Pagination from '../../sharedComponents/Pagination';
import PageSize from '../../sharedComponents/PageSize';
import TableData from '../../sharedComponents/TableData2';
import PageDropdown from '../../sharedComponents/PageDropDown';
import Loader from '../../sharedComponents/Loader';
import NewToast,{ showToast } from '../../sharedComponents/NewToast';
import sanitizeData from '../../utils/helpers/SanitizedData';
import {getMyWithdrawals} from '../../services/AgentService';
import BackButton from '../../sharedComponents/BackButton';

import { verifyAgent } from '../../services/AuthService';

const MyWithdrawals = () => {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAgent, setIsAgent] = useState(false);
  const [data, setData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(0);

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

      const responseData = await getMyWithdrawals(params); 
      const sanitizedData = sanitizeData(responseData.content);
      setData(sanitizedData);
      setNoOfPages(responseData.totalPages);
    } catch (error) {
      showToast('Error in Fetching Withdrawals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAgentStatus = async () => {
        try {
            const isAgent = await verifyAgent();
            if (isAgent) {
                setIsAgent(true);
                fetchData();
            }else{
                showToast('Unathorized Access! Please Login','error');
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
    checkAgentStatus();
}, [searchQuery, currentPage, size, direction, sortBy, isAgent]);

useEffect(() => {
    if (isAgent) {
      fetchData();
    }
  }, [searchQuery, currentPage, size, direction, sortBy, isAgent]);

  if(!isAgent){
    return null;
  }
  if (loading) {
    return <Loader />;
  }

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
    { label: 'Policy ID', value: 'policyId' },
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


  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 px-5" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
      <Row className="m-5">
          <Col md={8}>
            <h2>Withdrawals Data</h2> 
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
            <TableData data={data} fetchData={fetchData} status={"MyWithdrawal"} />
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
      <NewToast/>
      <Footer />
    </Container>
  )
}

export default MyWithdrawals