import React, {useState, useEffect} from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom';
import {Container, Row, Col, Card, Button} from 'react-bootstrap';

import Header from '../layout/Header';
import Footer from '../layout/Footer';

import DashboardCard from '../../sharedComponents/DashboardCard';
import Loader from '../../sharedComponents/Loader';
import NewToast,{ showToast } from '../../sharedComponents/NewToast';

import { verifyAgent, getUsername } from '../../services/AuthService';
import AgentEarnings from './AgentEarnings';
import {getSoldPolicies, getCancelledPolicies, getCommission, getPenalty} from '../../services/DashboardService';


const AgentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAgent, setIsAgent] = useState(false);
  const [username, setUsername] = useState('');
  const [soldPolicies, setSoldPolicies] = useState(0);
  const [cancelledPolicies, setCancelledPolicies] = useState(0);
  const [commission, setCommission] = useState(0);
  const [penalty, setPenalty] = useState(0);

  useEffect(() => {
    const checkAgentStatus = async () => {
        try {
            const isAgent = await verifyAgent();
            if (isAgent) {
                setIsAgent(true);
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
          const [soldPolicies, cancelledPolicies, commission, penalty,username] = await Promise.all([
            getSoldPolicies(),
            getCancelledPolicies(),
            getCommission(),
            getPenalty(),
            getUsername()
        ]);
       setSoldPolicies(soldPolicies);
       setCancelledPolicies(cancelledPolicies);
       setCommission(commission);
       setPenalty(penalty);
       setUsername(username);
        } catch (error) {
            showToast('Error Loading Dashboard Data','error');           
        }finally{
            setLoading(false);
        }
    };
    checkAgentStatus();
}, [navigate]);

  if(!isAgent){
    return null;
  }
  if (loading) {
    return <Loader />;
  }

 
  const handleCommission = () =>{
    navigate('/SecureLife.com/agent/commissions')
  }
  const handleWithdrawal = () =>{
    navigate('/SecureLife.com/agent/withdrawals')
  }
  const handleClient = () =>{
    navigate('/SecureLife.com/agent/customers')
  }
  

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 px-5" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
      <Row className="px-5 mb-5">
        <Col xs={12} md={6}> 
              <div className="text-center">
                  <h1 className="display-4">Welcome, {username}!</h1>
                  <p className="lead">Your dashboard for view your commissions.</p>
              </div>

      </Col>
      <Col xs={12} md={6}>
  <Card className="w-100" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
    <Row>
      <Col xs={4} className="d-flex flex-column justify-content-center align-items-center" style={{ borderRight: '1px solid #ddd' }}>
        <div>
          <h6>Sold Policies</h6>
          <p className="text-center">{soldPolicies}</p>
        </div>
        <div>
          <h6>Cancelled Policies</h6>
          <p className="text-center">{cancelledPolicies}</p> 
        </div>
      </Col>

      
      <Col xs={8} className='px-5'>
        <Card.Body>
          <AgentEarnings commission={commission} penalty={penalty} />
        </Card.Body>
      </Col>
    </Row>
  </Card>
</Col>

    </Row>

        <Row className="px-5 mb-5">
          <Col md={4}>
            <DashboardCard title={"My Clients"} handleButton={handleClient} buttonText={"View Clients"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"Sold Policies"} handleButton={handleCommission} buttonText={"View Sold Policies"}/>
          </Col>
          <Col md={4}>
            <DashboardCard title={"Cancelled Policies"} handleButton={handleWithdrawal} buttonText={"View Cancelled Policies"}/>
          </Col>        
        </Row>

      </Container>
      <NewToast/>
      <Footer />
    </Container>
  )
}

export default AgentDashboard

