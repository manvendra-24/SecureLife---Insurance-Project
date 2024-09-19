import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import CustomerHeader from '../layout/CustomerHeader'; 
import Footer from '../layout/Footer';

import DashboardCard from '../../sharedComponents/DashboardCard';
import Loader from '../../sharedComponents/Loader';
import NewToast from '../../sharedComponents/NewToast'; 
import QueryModal from './CustomerQueryForm'; 
import DocumentUploadModal from './DocumentUploadModal'; 
import { successToast, errorToast } from '../../sharedComponents/MyToast';
import { verifyCustomer, getProfile } from '../../services/AuthService'; 

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [showQueryModal, setShowQueryModal] = useState(false); 
  const [showUploadModal, setShowUploadModal] = useState(false); 

  useEffect(() => {
    const checkCustomerStatus = async () => {
      try {
        const isCustomer = await verifyCustomer();
        if (isCustomer) {
          setIsCustomer(true);
          await fetchProfileData();
        } else {
          errorToast('Unauthorized Access! Please Login', 'error');
          setTimeout(() => {
            navigate('/SecureLife.com/login');
          }, 1000);
        }
      } catch (error) {
        errorToast('Internal Server Error', 'error');
        setTimeout(() => {
          navigate('/SecureLife.com/login');
        }, 1000);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileData = async () => {
      try {
        const profileData = await getProfile();
        setCustomerName(profileData.name);
      } catch (error) {
        errorToast('Failed to load profile', 'error');
      }
    };

    checkCustomerStatus();
  }, [navigate]);

  if (!isCustomer) {
    return null;
  }
  if (loading) {
    return <Loader />;
  }

  const handleGetPolicy = () => {
    navigate('/SecureLife.com/customer/mypolicies');
  };

  const handleWriteQuery = () => {
    setShowQueryModal(true); 
  };

  const handleCloseQueryModal = () => {
    setShowQueryModal(false); 
  };

  const handleViewAllQueries = () => {
    navigate('/SecureLife.com/customer/queries');
  };

  const handleShowUploadModal = () => {
    setShowUploadModal(true); 
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false); 
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <CustomerHeader /> 
      <Container fluid className="py-5 px-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="px-5 mb-5">
          <Col xs={12} md={6}>
            <div className="text-center">
              <h1 className="display-4">Welcome, {customerName}!</h1>
              <p className="lead">Your dashboard for managing your profile and services.</p>
            </div>
          </Col>
        </Row>
        <Row className="px-5">
          <Col md={4}>
            <DashboardCard
              title="View Policy"
              text="View and manage your policies"
              handleButton={handleGetPolicy}
              buttonText="View Policy"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              title="Write Query"
              text="Submit a query for support"
              handleButton={handleWriteQuery} 
              buttonText="Write Query"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              title="View All Queries"
              text="View all customer queries and responses"
              handleButton={handleViewAllQueries}
              buttonText="View All Queries"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              title="Upload Documents"
              text="Upload important documents like Aadhaar and PAN"
              handleButton={handleShowUploadModal} 
              buttonText="Upload Documents"
            />
          </Col>
        </Row>
      </Container>
      <NewToast />
      <Footer />

      
      <QueryModal show={showQueryModal} handleClose={handleCloseQueryModal} />

      
      <DocumentUploadModal show={showUploadModal} handleClose={handleCloseUploadModal} />
    </Container>
  );
};

export default CustomerDashboard;
