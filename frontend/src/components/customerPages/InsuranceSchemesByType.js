import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { getInsuranceSchemesByTypeId } from '../../services/CustomerService';
import { Container, Row, Card, Carousel, Button } from 'react-bootstrap';
import defaultImage from '../../assets/images/fasttrack.png'; 
import CustomerHeader from '../layout/CustomerHeader';
import Footer from '../layout/Footer';
import { verifyCustomer } from '../../services/AuthService'; 
import { ToastContainer } from 'react-toastify';
import { successToast, errorToast } from '../../sharedComponents/MyToast'; 

const schemeImages = {
  FastTrack: defaultImage, 
  OldAgeScheme: require('../../assets/images/oldagescheme.png'),
};

const schemeDescriptions = {
  FastTrack: 'The FastTrack scheme offers a high return with a shorter maturity period, perfect for those looking for quick financial growth. It is designed to accommodate those who are risk-takers with a goal for rapid financial expansion. This scheme focuses on maximizing returns in a short period, ideal for business owners and young professionals looking to grow their wealth. Additionally, the scheme provides flexibility in payments and coverage, making it highly adaptable to market conditions. Join this plan today and see your investment grow quickly over the years.',
  
  OldAgeScheme: 'The Old Age Scheme ensures financial stability during retirement, providing a regular stream of income for essential expenses. With guaranteed payouts and a focus on long-term care, this scheme is perfect for those looking to secure their golden years without any financial burden. It offers a sense of comfort and peace knowing that you are financially prepared for healthcare, housing, and leisure activities. The scheme also comes with added benefits such as healthcare packages and community support services. It’s more than just insurance; it’s a lifetime of peace and care for your future needs.'
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
    <Container fluid className="px-0">
      <CustomerHeader />
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
                        {schemeDescriptions[scheme.name] || scheme.description || 'No description available.'}
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
