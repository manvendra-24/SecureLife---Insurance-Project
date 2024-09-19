import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {submitWithdrawalRequest } from '../../services/CustomerService';
import { getMyPolicies, uploadDocument, submitClaim } from '../../services/CustomerService'; 
import PageDropdown from '../../sharedComponents/PageDropDown';
import Pagination from '../../sharedComponents/Pagination';
import PageSize from '../../sharedComponents/PageSize';
import TableData from '../../sharedComponents/TableData';
import Loader from '../../sharedComponents/Loader';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import ClaimModal from './ClaimModal';  
import WithdrawModal from './WithDrawModal';  
import { successToast, errorToast } from '../../sharedComponents/MyToast'; 
import {verifyCustomer} from '../../services/AuthService' 
import { ToastContainer } from 'react-toastify';
import BackButton from '../../sharedComponents/BackButton';



const ViewPolicyTable = () => {
  const [isCustomer, setIsCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [noOfPages, setNoOfPages] = useState(0);
  const [sortBy, setSortBy] = useState('policyId');  
  const [direction, setDirection] = useState('asc');  

  const [showClaimModal, setShowClaimModal] = useState(false); 
  const [selectedPolicyId, setSelectedPolicyId] = useState(null); 

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);  
  const [selectedPolicyName, setSelectedPolicyName] = useState(null);  

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page'), 10) || 1;
  const size = parseInt(searchParams.get('size'), 10) || 5;

  useEffect(() => {
    const checkCustomerStatus = async () => {
      try {
        const isCustomer = await verifyCustomer();
        setIsCustomer(isCustomer);
        if (!isCustomer) {
          navigate('/SecureLife.com/login');
        }
      } catch (error) {
        console.error('Error during customer verification:', error);
        navigate('/SecureLife.com/login');
      }
    };

    checkCustomerStatus();
  }, [navigate]);

  const fetchData = useCallback(() => {
    const params = {
      page: currentPage - 1,
      size,
      sortBy,  
      direction, 
    };

    getMyPolicies(params)
      .then((responseData) => {
        setData(responseData.content);
        setNoOfPages(responseData.totalPages);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the policies!', error);
        setError('Error in getting policies');
        setLoading(false);
      });
  }, [currentPage, size, sortBy, direction]);

  useEffect(() => {
    if (isCustomer !== null) {
      fetchData();
    }
  }, [fetchData, isCustomer]);

  
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);  
    setLoading(true);

    setSearchParams({
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
      page: 1,
      size: 5,
      sortBy: 'policyId',
      direction: 'asc',
    });
  };

  const handlePageChange = (page) => {
    setLoading(true);
    setSearchParams({
      page,
      size,
      sortBy,  
      direction,
    });
  };

  const handleSizeChange = (newSize) => {
    setLoading(true);
    setSearchParams({
      page: 1,
      size: newSize,
      sortBy,  
      direction, 
    });
  };

  const handleWithdraw = (policyId, policyName) => {
    setSelectedPolicyId(policyId);  
    setSelectedPolicyName(policyName);  
    setShowWithdrawModal(true);  
  };

  const handleSubmitWithdraw = async (policyId) => {
    try {
      const response = await submitWithdrawalRequest(policyId);
      successToast('Withdrawal request sent successfully');
      setShowWithdrawModal(false);  
    } catch (error) {
      console.error('Error during withdrawal submission:', error);
      errorToast('You cannot withdraw same policy multiple times');
    }
  };

  const handleCloseWithdrawModal = () => {
    setShowWithdrawModal(false);
  };

  const handleClaim = (policyId) => {
    setSelectedPolicyId(policyId);  
    setShowClaimModal(true);  
  };

  const handleInstallment=(policyId)=>{
    navigate(`/SecureLife.com/customer/policies/${policyId}/installments`)
  }

  const handleSubmitClaim = async (explanation, file, policyId) => {
    try {
      const documentType = "CLAIM_DOCUMENT";  
      const uploadResponse = await uploadDocument(documentType, file);
      
      if (uploadResponse.status === 200) {
        const documentId = uploadResponse.data;
        const claimRequest = {
          documentId,
          explanation,
        };
       
        const claimResponse = await submitClaim(policyId, claimRequest);
        successToast('Claim request sent  successfully');
        setShowClaimModal(false);  
      }
    } catch (error) {
      console.error('Error during claim submission:', error);
      errorToast('Failed to submit claim');
    }
  };

  const handleCloseClaimModal = () => {
    setShowClaimModal(false);
  };

  if (loading) {
    return <Loader />;
  }

  

  const sortOptions = [
    { label: 'Policy ID', value: 'policyId' },
    { label: 'Policy Name', value: 'policyName' },
  ];

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header/>
          <Container fluid className="px-5 py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
          <Row className="m-5">
          <Col xs={6} md={6}>
            <h2>My Policies</h2>
          </Col>
          
        </Row>
          <Row className="m-5">
            <Col md={1}>
              <DropdownButton title={sortBy ? sortBy : "Sort By"} variant="outline-secondary">
                {sortOptions.map(option => (
                  <Dropdown.Item key={option.value} onClick={() => handleSortChange(option.value)}>
                    {option.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col md={1}>
              <DropdownButton title={direction ? direction : "Direction"} variant="outline-secondary">
                <Dropdown.Item onClick={() => handleDirectionChange('asc')}>Asc</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDirectionChange('desc')}>Desc</Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col md={6}>
              <Button variant="secondary" onClick={handleReset}>Reset</Button>
            </Col>
            <Col md={4} className="d-flex justify-content-end">
              <PageDropdown noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
              <PageSize size={size} setSize={handleSizeChange} />
            </Col>
          </Row>
          <Row className="m-5">
          {data.length > 0 && (
            <div>
              <TableData
                data={data}
                isViewPolicyTable={true}  
                onClaim={handleClaim}
                onWithdraw={(policyId, policyName) => handleWithdraw(policyId, policyName)}
                onInstallment={handleInstallment}
              />
            </div>
          )}
          </Row>
          <Row className="m-5">
            <Col md={6}>
              <Pagination noOfPages={noOfPages} currentPage={currentPage} setPageNo={handlePageChange} />
            </Col>
            <Col md={6} style={{ textAlign: 'right' }}>
              <BackButton />
            </Col>
          </Row>
        </Container>

      <ClaimModal
        show={showClaimModal}
        handleClose={handleCloseClaimModal}
        handleSubmitClaim={handleSubmitClaim}
        selectedPolicyId={selectedPolicyId}
      />

      
      <WithdrawModal
        show={showWithdrawModal}
        handleClose={handleCloseWithdrawModal}
        handleSubmitWithdraw={handleSubmitWithdraw}
        policyId={selectedPolicyId}
        policyName={selectedPolicyName}
      />
      <Footer />
      <ToastContainer/>
    </Container>
  );
};

export default ViewPolicyTable;

