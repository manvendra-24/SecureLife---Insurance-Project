import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { getAllQueries } from '../../services/CustomerService'; 

import Loader from '../../sharedComponents/Loader';
import NewToast, { showToast } from '../../sharedComponents/NewToast';
import ResponseModal from './ResponseModal'; 
import BackButton from '../../sharedComponents/BackButton';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import SearchBar from '../../sharedComponents/SearchBar'; 

const ViewQueriesForEmployee = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [size] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    fetchQueries();
  }, [page, searchQuery]); 
  const fetchQueries = async () => {
    try {
      setLoading(true);
      const response = await getAllQueries(page, size, searchQuery); 
      setQueries(response.content);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      showToast('Failed to load queries', 'error');
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleGiveResponse = (query) => {
    setSelectedQuery(query);
    setShowResponseModal(true);
  };

  const handleCloseResponseModal = () => {
    setShowResponseModal(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query); 
    setPage(0); 
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container fluid className="d-flex flex-column px-0">
      <Header/>
      <Container fluid className="px-5 py-5" style={{ backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
        <Row className="m-5">
          <Col xs={12}>
            <h2>Customer Queries</h2>
          </Col>
        </Row>
      
        <Row className="m-5">
          <Col xs={12}>
            <SearchBar onSearch={handleSearch} defaultValue={searchQuery} />
          </Col>
        </Row>
        <Row className="m-5">
          {queries.length === 0 ? (
            <p>No queries available.</p>
          ) : (
            queries.map((query) => (
              <Col md={6} key={query.queryId}>
                <div className="query-item my-3 p-3" style={{ border: '1px solid #ccc', borderRadius: '5px' }}>
                  <p><strong>Query ID:</strong> {query.queryId}</p>
                  <p><strong>Customer ID:</strong> {query.customerId}</p>
                  <p><strong>Question:</strong> {query.message}</p>
                  <p>
                    <strong>Answer:</strong> {query.response ? query.response : 'No response yet'} 
                    {query.employeeId && ` (Employee ID: ${query.employeeId})`}
                  </p>
                  <Button variant="primary" onClick={() => handleGiveResponse(query)}>
                    Give Response
                  </Button>
                </div>
              </Col>
            ))
          )}
        </Row>
        <Row className="m-5">
          <Col md={9}>
            <button onClick={handlePreviousPage} disabled={page === 0} className="btn btn-primary mx-2">
              Previous
            </button>
            <button onClick={handleNextPage} disabled={page === totalPages - 1} className="btn btn-primary mx-2">
              Next
            </button>
          </Col>
          <Col md={3} style={{ textAlign: 'right' }}>
            <BackButton />
          </Col>
        </Row>
        
        {selectedQuery && (
          <ResponseModal
            show={showResponseModal}
            handleClose={handleCloseResponseModal}
            selectedQuery={selectedQuery}
            refreshQueries={fetchQueries}
          />
        )}
      </Container>
      <Footer/>
      <NewToast/>
    </Container>
  );
};

export default ViewQueriesForEmployee;
