import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { Container, Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <Container fluid className="bg-light text-dark d-flex flex-column min-vh-100">
        <Header />
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <Spinner animation="border" />
            </div>
        <Footer />
    </Container>
  )
}

export default Loader