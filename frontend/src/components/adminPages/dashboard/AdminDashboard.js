import React, {useState, useEffect} from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';

import Header from '../../layout/Header';
import Footer from '../../layout/Footer';

import DashboardCard from '../../../sharedComponents/DashboardCard';
import Loader from '../../../sharedComponents/Loader';
import NewToast,{ showToast } from '../../../sharedComponents/NewToast';
import PieChart from '../../../sharedComponents/PieChart';

import { getUsername, verifyAdmin } from '../../../services/AuthService';
import {getTotalAdmins, getTotalAgents, getTotalCustomers, getTotalEmployees} from '../../../services/DashboardService';
import {viewTaxSetting, createInsuranceSetting, viewInsuranceSetting, createTaxSetting } from '../../../services/AdminService';

import InsuranceSettingForm from '../update/InsuranceSettingForm';
import TaxSettingForm from '../update/TaxSettingForm';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalAgents, setTotalAgents] = useState(0);
  const [username, setUsername] = useState('');
  const [currentTaxPercentage, setCurrentTaxPercentage] = useState('');
  const [currentClaimDeduction, setCurrentClaimDeduction] = useState('');
  const [currentPenaltyAmount, setCurrentPenaltyAmount] = useState('');

  useEffect(() => {
    const checkAdminStatus = async () => {
        try {
            const isAdmin = await verifyAdmin();
            if (isAdmin) {
                setIsAdmin(true);
                await fetchDashboardData();
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

    const fetchDashboardData = async () => {
        try {
             const [adminResponse, customerResponse, agentResponse, employeeResponse,username] = await Promise.all([
                 getTotalAdmins(),
                 getTotalCustomers(),
                 getTotalAgents(),
                 getTotalEmployees(),
                 getUsername()
             ]);
            setTotalAdmins(adminResponse);
            setTotalCustomers(customerResponse);
            setTotalAgents(agentResponse);
            setTotalEmployees(employeeResponse);
            setUsername(username);

            const taxData = await viewTaxSetting();
            setCurrentTaxPercentage(taxData.taxPercentage);

            const insuranceData = await viewInsuranceSetting();
            setCurrentClaimDeduction(insuranceData.claimDeduction);
            setCurrentPenaltyAmount(insuranceData.penaltyAmount);
        } catch (error) {
            showToast('Error Loading Dashboard Data','error');           
        }finally{
            setLoading(false);
        }
    };
    checkAdminStatus();
}, [navigate]);

  if(!isAdmin){
    return null;
  }
  if (loading) {
    return <Loader />;
  }

  const data = [
    { label: 'Customers', value: totalCustomers },
    { label: 'Agents', value: totalAgents },
    { label: 'Admins', value: totalAdmins },
    { label: 'Employees', value: totalEmployees },
  ];
  const handleCity = () =>{
    navigate('/SecureLife.com/admin/cities')
  }
  const handleState = () =>{
    navigate('/SecureLife.com/admin/states')
  }
  const handleCustomer = () =>{
    navigate('/SecureLife.com/admin/customers')
  }
  const handleAdmin = () =>{
    navigate('/SecureLife.com/admin/admins')
  }
  const handleAgent = () =>{
    navigate('/SecureLife.com/admin/agents')
  }
  const handleEmployee = () =>{
    navigate('/SecureLife.com/admin/employees')
  }
  const handleInsurance = () =>{
    navigate('/SecureLife.com/admin/types')
  }
  const handleWithdrawal = () =>{
    navigate('/SecureLife.com/admin/withdrawals')
  }
  const handleClaim = () =>{
    navigate('/SecureLife.com/admin/claims')
  }

  const handleTaxSubmit = async (e) => {
    try {
      const taxPercentage = parseFloat(e.taxPercentage);
      await createTaxSetting({ taxPercentage });
      showToast('Tax setting created successfully', 'success');
      setShowTaxModal(false);
    } catch (error) {
      showToast('Failed to create tax setting', 'error');
    }
  };
  
  const handleInsuranceSubmit = async (e) => {
    try {
      const claimDeduction = parseFloat(e.claimDeduction);
      const penaltyAmount = parseFloat(e.penaltyAmount);
      await createInsuranceSetting({ claimDeduction, penaltyAmount });
      showToast('Insurance setting created successfully', 'success');
      setShowInsuranceModal(false);
    } catch (error) {
      showToast('Failed to create insurance setting', 'error');
    }
  };

  const handleTaxSetting = ()=>{
    setShowTaxModal(true)
  }
  const handleInsuranceSetting = ()=>{
    setShowInsuranceModal(true)
  }

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <InsuranceSettingForm
        show={showInsuranceModal}
        handleClose={() => setShowInsuranceModal(false)}
        handleSave={handleInsuranceSubmit}
        initialClaimDeduction={currentClaimDeduction}
        initialPenaltyAmount={currentPenaltyAmount}
      />
      <TaxSettingForm
        show={showTaxModal}
        handleClose={() => setShowTaxModal(false)}
        handleSave={handleTaxSubmit}
        initialTaxPercentage={currentTaxPercentage}
      />
      <Container fluid className="py-5 px-5" style={{backgroundColor:'rgba(230, 242, 255, 0.4)'}}>
      <Row className="px-5 mb-5">
        <Col xs={12} md={6}> 

          <Row className="px-0 m-5">
            <Col md={12}>
              <div className="text-center" style={{marginTop:'60px', marginBottom:'45px'}}>
                  <h1 className="display-4">Welcome, {username}!</h1>
                  <p className="lead">Your dashboard for managing the system.</p>
              </div>
            </Col>
          </Row>


          <Row className="px-0">
            <Col md={6} className="text-center">
              <DashboardCard title="Tax Settings" handleButton={handleTaxSetting} buttonText={"View Tax Settings"}/>
            </Col>
            <Col md={6} className="text-center">
              <DashboardCard title="Insurance Settings" handleButton={handleInsuranceSetting} buttonText={"View Insurance Settings"}/>
            </Col>
          </Row>
      </Col>

      <Col xs={12} md={6} className="d-flex align-items-center justify-content-center px-3">
        <Card className="w-100" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
          <Row>
            <Col md={12} className="d-flex align-items-center justify-content-center">
              <Card.Title className="display-6 text-center">Users</Card.Title>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Card.Body>
                <PieChart data={data} />
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>

        <Row className="px-5 mb-3">
          <Col md={4}>
            <DashboardCard title={"Customer Management"} text={"Manage all customers"} handleButton={handleCustomer} buttonText={"View Customers"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"Agent Management"} text={"Manage all agents"} handleButton={handleAgent} buttonText={"View Agents"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"Employee Management"} text={"Manage all employees"} handleButton={handleEmployee} buttonText={"View Employees"}/>
          </Col>        
        </Row>

        <Row className="px-5 mb-3">
          <Col md={4}>
            <DashboardCard title={"Admin Management"} text={"Manage all admins"} handleButton={handleAdmin} buttonText={"View Admins"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"City Management"} text={"Manage all cities"} handleButton={handleCity} buttonText={"View Cities"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"State Management"} text={"Manage all states"} handleButton={handleState} buttonText={"View States"}/>
          </Col> 
        </Row>

        <Row className="px-5 mb-3">
          <Col md={4}>
            <DashboardCard title={"Insurance Management"} text={"Manage all insurances"} handleButton={handleInsurance} buttonText={"View Insurances"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"Withdrawal Management"} text={"Manage all withdrawal"} handleButton={handleWithdrawal} buttonText={"Withdrawal Requests"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"Claim Management"} text={"Manage all claim"} handleButton={handleClaim} buttonText={"Claim Requests"}/>
          </Col>
        </Row>
      </Container>
      <NewToast/>
      <Footer />
    </Container>
  )
}

export default AdminDashboard

