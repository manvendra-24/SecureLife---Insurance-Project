import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaUsers, FaRegAddressCard, FaFileAlt, FaChartBar, FaShieldAlt } from 'react-icons/fa'; 

import Header from '../layout/Header';
import Footer from '../layout/Footer';
import DashboardCard from '../../sharedComponents/DashboardCard';
import Loader from '../../sharedComponents/Loader';
import NewToast from '../../sharedComponents/NewToast';
import CommissionReportModal from './CommissionReportModal';
import ViewPolicyReportModal from './ViewPolicyReportModal'; 

import { getProfile, verifyEmployee } from '../../services/AuthService';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState({});
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false); 

  useEffect(() => {
    const checkEmployeeStatus = async () => {
      try {
        const isEmployee = await verifyEmployee();
        if (isEmployee) {
          await fetchDashboardData();
        } else {
          navigate('/SecureLife.com/login');
        }
      } catch (error) {
        console.error('Error during employee verification:', error);
        navigate('/SecureLife.com/login');
      }
    };

    const fetchDashboardData = async () => {
      try {
        const employeeData = await getProfile();
        setEmployee(employeeData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    checkEmployeeStatus();
  }, [navigate]);

  if (loading) {
    return <Loader />;
  }

  const handleAddAgent = () => navigate('/SecureLife.com/employee/agents/new');
  const handleViewCustomers = () => navigate('/SecureLife.com/employee/customers');
  const handleViewAgents = () => navigate('/SecureLife.com/employee/agents');
  const handleViewQueries = () => navigate('/SecureLife.com/employee/queries');
  const handleViewCommissionReport = () => setShowCommissionModal(true);
  const handleViewPolicyReport = () => setShowPolicyModal(true); 
  const handleCloseCommissionModal = () => setShowCommissionModal(false);
  const handleClosePolicyModal = () => setShowPolicyModal(false); 

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <CommissionReportModal show={showCommissionModal} handleClose={handleCloseCommissionModal} />
      <ViewPolicyReportModal show={showPolicyModal} handleClose={handleClosePolicyModal} />
      <Container fluid className="py-5 px-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.4)' }}>
        <Row className="px-5 mb-5">
          <Col md={12}>
            <div className="text-left">
              <h1 className="display-4">Welcome, {employee.username || "Employee"}!</h1>
              <p className="lead">Your dashboard for managing the system.</p>
            </div>
          </Col>
        </Row>

        <Row className="px-5 mb-4">
          <Col md={4}>
            <DashboardCard
              icon={<FaUserTie />}
              title="Add Agent"
              text="Manage agents and add new ones."
              handleButton={handleAddAgent}
              buttonText="Add Agent"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              icon={<FaUsers />}
              title="View Customers"
              text="View and manage customer information."
              handleButton={handleViewCustomers}
              buttonText="View Customers"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              icon={<FaRegAddressCard />}
              title="View Agents"
              text="View and manage agent information."
              handleButton={handleViewAgents}
              buttonText="View Agents"
            />
          </Col>
        </Row>

        <Row className="px-5">
          <Col md={4}>
            <DashboardCard
              icon={<FaFileAlt />}
              title="View Queries"
              text="Manage all queries from customers and agents."
              handleButton={handleViewQueries}
              buttonText="View Queries"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              icon={<FaChartBar />}
              title="Commission Report"
              text="View Commission report by Agent ID"
              handleButton={handleViewCommissionReport}
              buttonText="View Report"
            />
          </Col>
          <Col md={4}>
            <DashboardCard
              icon={<FaShieldAlt />}
              title="Policy Report" 
              text="View Policy Report by Customer ID."
              handleButton={handleViewPolicyReport} 
              buttonText="View Report"
            />
          </Col>
        </Row>
      </Container>
      <NewToast />
      <Footer />
    </Container>
  );
};

export default EmployeeDashboard;
