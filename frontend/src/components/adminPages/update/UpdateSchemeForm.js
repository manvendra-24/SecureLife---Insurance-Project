import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { successToast, errorToast } from '../../../sharedComponents/MyToast';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import Loader from '../../../sharedComponents/Loader';

const UpdateInsuranceSchemeForm = () => {
    const { schemeId } = useParams();
    const [scheme, setScheme] = useState({
        schemeName: '',
        description: '',
        newRegistrationCommission: '',
        withdrawalPenalty: ''
    });
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchScheme = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/SecureLife.com/scheme/${schemeId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setScheme({
                    schemeName: response.data.name,
                    description: response.data.description,
                    newRegistrationCommission: response.data.registrationCommissionForAgent,
                    withdrawalPenalty: response.data.withdrawalPenaltyForAgent
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching insurance scheme details:', error);
            }
        };

        fetchScheme();
    }, [schemeId]);

    const validateForm = () => {
        const newErrors = {};
        if (!scheme.schemeName) newErrors.schemeName = "Scheme Name is required";
        if (!scheme.newRegistrationCommission || isNaN(scheme.newRegistrationCommission) || Number(scheme.newRegistrationCommission) <= 0) {
            newErrors.newRegistrationCommission = "Valid Registration Commission is required";
        }
        if (!scheme.withdrawalPenalty || isNaN(scheme.withdrawalPenalty) || Number(scheme.withdrawalPenalty) <= 0) {
            newErrors.withdrawalPenalty = "Valid Withdrawal Penalty is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setScheme((prevScheme) => ({
            ...prevScheme,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await axios.put(`http://localhost:8081/SecureLife.com/scheme/${schemeId}/update`, {
                    schemeName: scheme.schemeName,
                    description: scheme.description,
                    newRegistrationCommission: parseFloat(scheme.newRegistrationCommission),
                    withdrawalPenalty: parseFloat(scheme.withdrawalPenalty)
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                successToast("Insurance scheme updated successfully");
                setTimeout(() => { navigate(-1); }, 1000);
            } catch (error) {
                console.error('Error updating insurance scheme:', error);
                errorToast("Failed to update the insurance scheme!");
            }
        } else {
            errorToast("Please fix the validation errors.");
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <Container fluid className="d-flex flex-column min-vh-100 px-0">
            <Header role="admin" />
            <Container fluid className="d-flex flex-grow-1 justify-content-center align-items-center py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
                <Row className="w-100 justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Card className="p-4 shadow-lg" style={{ backgroundColor: 'rgba(230, 242, 255, 0.85)', border: 'none', borderRadius: '10px' }}>
                            <div className="text-center mb-4">
                                <h3>Update Insurance Scheme</h3>
                                <p className="text-muted">Update the details of the existing insurance scheme.</p>
                            </div>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="schemeName" className="mb-3">
                                    <Form.Label>Scheme Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="schemeName"
                                        value={scheme.schemeName}
                                        onChange={handleChange}
                                        isInvalid={!!errors.schemeName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.schemeName}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group controlId="newRegistrationCommission" className="mb-3">
                                    <Form.Label>New Registration Commission</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="newRegistrationCommission"
                                        value={scheme.newRegistrationCommission}
                                        onChange={handleChange}
                                        isInvalid={!!errors.newRegistrationCommission}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.newRegistrationCommission}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="withdrawalPenalty" className="mb-3">
                                    <Form.Label>Withdrawal Penalty</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="withdrawalPenalty"
                                        value={scheme.withdrawalPenalty}
                                        onChange={handleChange}
                                        isInvalid={!!errors.withdrawalPenalty}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.withdrawalPenalty}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Row>
                                    <Col>
                                        <Button variant="primary" type="submit" className="w-100">
                                            Update Scheme
                                        </Button>
                                    </Col>
                                    <Col style={{ textAlign: 'right' }}>
                                        <Button variant="secondary" onClick={() => navigate(-1)} className="w-100">
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </Container>
    );
};

export default UpdateInsuranceSchemeForm;
