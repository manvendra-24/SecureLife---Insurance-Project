import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { getProfile, updateProfile } from '../services/AuthService';
import { successToast, errorToast } from '../sharedComponents/MyToast';
import Header from './layout/Header';
import Footer from './layout/Footer';

import defaultProfileIcon from '../assets/vectors/profile.svg';
import BackButton from '../sharedComponents/BackButton';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    username: '',
    name: '',
    email: '',
    address: '',
    phoneNumber: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        console.log(data)
        setProfileData(data);
      } catch (error) {
        errorToast('Failed to fetch profile data.');
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      successToast('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      errorToast('Failed to update profile.');
    }
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="py-5 flex-grow-1" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4 shadow-lg" style={{ backgroundColor: 'rgba(230, 242, 255, 0.85)' }}>
              <Card.Body>
                <Row className="align-items-center mb-4">
                  <Col xs={3} className="text-center">
                    <img
                      src={defaultProfileIcon}
                      alt="Profile Icon"
                      style={{ width: '80px', height: '80px', borderRadius: '50%' }}
                    />
                  </Col>
                  <Col xs={9}>
                    <h3 className="text-center">Profile</h3>
                  </Col>
                </Row>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPhoneNumber">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleChange}
                      readOnly={!isEditing}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      name="role"
                      value={profileData.role}
                      onChange={handleChange}
                      readOnly
                    />
                  </Form.Group>

                  {!isEditing ? (
                    <Row>
                      <Col md={6}>
                      <Button variant="primary" onClick={() => setIsEditing(true)} className="mt-3">
                        Edit
                      </Button>
                      <Button variant="warning" onClick={() => navigate('/SecureLife.com/user/password/change')} className="mt-3 ms-2">
                        Change Password
                      </Button>
                      </Col>
                      <Col md={6} className="justify-content-end mt-3" style={{textAlign:'right'}}>
                      <BackButton/>
                      </Col>
                    </Row>
                    
                  ) : (
                    <Row>
                    <Col md={6}>
                      <Button type="submit" variant="success" className="mt-3">
                        Update
                      </Button>
                      <Button variant="secondary" onClick={() => setIsEditing(false)} className="mt-3 ms-2">
                        Cancel
                      </Button>
                    </Col>
                    <Col md={6} className="justify-content-end mt-3" style={{textAlign:'right'}}>
                    <BackButton/>
                    </Col>
                    </Row>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default Profile;
