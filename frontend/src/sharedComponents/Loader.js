import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Container, Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header/>
      <Container fluid className="py-5 flex-grow-1 d-flex justify-content-center align-items-center" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
          <Spinner animation="border" />
      </Container>
        <Footer />
    </Container>
  )
}

export default Loader