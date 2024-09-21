import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { getInsuranceSchemesByTypeId } from '../../services/CustomerService';
import { Container, Row, Card, Carousel, Button } from 'react-bootstrap';
import defaultImage from '../../assets/images/fasttrack.png'; 
import Footer from '../layout/Footer';
import { verifyCustomer } from '../../services/AuthService'; 
import { ToastContainer } from 'react-toastify';
import { successToast, errorToast } from '../../sharedComponents/MyToast'; 
import Header from '../layout/Header';

const schemeImages = {
  "Old Age Scheme": require('../../assets/images/oldagescheme.png'),
};



const InsuranceSchemesByType = () => {
  const { typeId } = useParams();
  const [schemes, setSchemes] = useState([]);
  const [isCustomer, setIsCustomer] = useState(null); 
  const navigate = useNavigate(); 

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

  useEffect(() => {
    if (isCustomer) {
      const fetchSchemes = async () => {
        try {
          const response = await getInsuranceSchemesByTypeId(typeId);
          console.log('Fetched Schemes:', response.content);
          setSchemes(response.content);
        } catch (error) {
          console.error('Error fetching schemes:', error);
          errorToast('Failed to fetch insurance schemes.');
        }
      };

      fetchSchemes();
    }
  }, [typeId, isCustomer]);

  const handleExploreMore = (schemeId) => {
    navigate(`/SecureLife.com/user/schemes/${schemeId}`);
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header />
      <Container fluid className="px-5 py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="justify-content-center py-5">
          <h2 className="text-center">Insurance Schemes</h2>
          {schemes.length > 0 ? (
            <Carousel 
              indicators={false} 
              controls={true} 
              nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" style={{ filter: 'invert(1)' }} />}
              prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" style={{ filter: 'invert(1)' }} />} 
            >
              {schemes.map((scheme) => (
                <Carousel.Item key={scheme.insuranceSchemeId}>
                  <Card className="text-center shadow" style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(193, 220, 220, 0.5)' }}>
                    <Card.Img 
                      variant="top" 
                      src={schemeImages[scheme.name] || defaultImage}  
                      alt={scheme.name}
                      style={{ width: '300px', height: '300px', margin: '0 auto' }}  
                    />
                    <Card.Body>
                      <Card.Title>{scheme.name}</Card.Title>
                      <Card.Text>
                        { scheme.description || 'No description available.'}
                      </Card.Text>
                      <Button variant="primary" onClick={() => handleExploreMore(scheme.insuranceSchemeId)}>
                        Explore More
                      </Button>
                    </Card.Body>
                  </Card>
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <p className="text-center">No schemes available for this insurance type.</p>
          )}
        </Row>
      </Container>
      <Footer />
      <ToastContainer />
    </Container>
  );
};

export default InsuranceSchemesByType;
