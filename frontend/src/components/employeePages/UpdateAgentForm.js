import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container,Row,Col } from 'react-bootstrap';
import axios from 'axios';
import { successToast, errorToast } from '../../sharedComponents/MyToast';
import { ToastContainer } from 'react-toastify';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import BackButton from '../../sharedComponents/BackButton';
const UpdateAgentForm = () => {
    const { agentId } = useParams();
    const [agent, setAgent] = useState({
        name: '',
        username: '',
        phoneNumber: '',
        address: '',
        city_id: '',
        
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    
    useEffect(() => {
        const fetchAgent = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/SecureLife.com/agents/${agentId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setAgent(response.data); 
                setLoading(false);
            } catch (error) {
                console.error('Error fetching agent details:', error);
            }
        };

        fetchAgent();
    }, [agentId]);

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgent((prevAgent) => ({ ...prevAgent, [name]: value }));
    };

   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8081/SecureLife.com/agent/${agentId}`, agent, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
           successToast("updated Successfully")
           setTimeout(()=>{ navigate('/view-agents'); },2000)
        } catch (error) {
            console.error('Error updating agent:', error);
            errorToast("failed to update!!")
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container fluid className="px-0 d-flex flex-column min-vh-100">
      <Header role="employee" />
      
      <div className="content-container flex-grow-1">
        <Container className="mt-5">
            <h1>Update Agent</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={agent.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={agent.username}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="phoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={agent.phoneNumber}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={agent.address}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="city_id">
                    <Form.Label>City ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="city_id"
                        value={agent.city_id}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                
             <Row>
                <Col>
                <Button variant="primary" type="submit" className="mt-3">
                    Update Agent
                </Button>
                </Col>
                <Col style={{textAlign:'right'}} className="mt-3 mb-3" >
                 <BackButton/>
                </Col>
                </Row>
            </Form>
            <ToastContainer/>
        </Container>
        </div>
        <Footer/>
    </Container>
    );
};

export default UpdateAgentForm;
