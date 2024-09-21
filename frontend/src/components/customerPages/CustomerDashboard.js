import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFileAlt, FaQuestionCircle, FaUpload, FaShieldAlt, FaClipboardList } from 'react-icons/fa';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

import DashboardCard from '../../sharedComponents/DashboardCard';
import Loader from '../../sharedComponents/Loader';
import NewToast from '../../sharedComponents/NewToast';
import QueryModal from './CustomerQueryForm';
import DocumentUploadModal from './DocumentUploadModal';
import { successToast, errorToast } from '../../sharedComponents/MyToast';
import { verifyCustomer, getProfile } from '../../services/AuthService';
import InsuranceTypesModal from './InsuranceTypeModal';


const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isCustomer, setIsCustomer] = useState(false);
  const [username, setUsername] = useState('');
  const [showQueryModal, setShowQueryModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);


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
        errorToast(error.specificMessage, 'error');
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
        setUsername(profileData.username);
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
  const handleShowInsuranceModal = () => {
    setShowInsuranceModal(true);
  }
  const handleCloseInsuranceModal = () => {
    setShowInsuranceModal(false);
  }

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 px-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="px-5 mb-5">
          <Col xs={12} md={12}>
            <div className="text-left">
              <h1 className="display-4">Welcome, {username}!</h1>
              <p className="lead">Your dashboard for managing your profile and services.</p>
            </div>
          </Col>
        </Row>
        <Row className="px-5">
        <Col md={4}>
            <DashboardCard
              icon={<FaClipboardList />}
              title="Explore Schemes"
              text="Explore Insurance Scheme"
              handleButton={handleShowInsuranceModal}
              buttonText="View Schemes"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              icon={<FaShieldAlt />}
              title="View Policy"
              text="View and manage your policies"
              handleButton={handleGetPolicy}
              buttonText="View Policy"
            />
          </Col>
          
          <Col md={4}>
            <DashboardCard
              icon={<FaFileAlt />} 
              title="View All Queries"
              text="View all customer queries and responses"
              handleButton={handleViewAllQueries}
              buttonText="View All Queries"
            />
          </Col>
        </Row>
        <Row className="mt-3 px-5">
          <Col md={4}>
            <DashboardCard
              icon={<FaUpload />} 
              title="Upload Documents"
              text="Upload important documents"
              handleButton={handleShowUploadModal}
              buttonText="Upload Documents"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              icon={<FaQuestionCircle />}
              title="Write Query"
              text="Submit a query for support"
              handleButton={handleWriteQuery}
              buttonText="Write Query"
            />
          </Col>
        </Row>
      </Container>
      <NewToast />
      <Footer />
      <InsuranceTypesModal show={showInsuranceModal} handleClose={handleCloseInsuranceModal} />
      <QueryModal show={showQueryModal} handleClose={handleCloseQueryModal} />
      <DocumentUploadModal show={showUploadModal} handleClose={handleCloseUploadModal} />
    </Container>
  );
};

export default CustomerDashboard;
