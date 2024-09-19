import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Container, Button, Row,Col } from 'react-bootstrap';
import BackButton from '../../../sharedComponents/BackButton';
import { downloadDocument} from '../../../services/EmployeeService';
import Footer from '../../layout/Footer';
import Header from '../../layout/Header';


const ClaimDocuments = () => {
  const location = useLocation();
  const { documents, claimId } = location.state || { documents: [], claimId: null };
  const handleDownload = (documentId,documentName) => {
    downloadDocument(documentId,documentName)
      .then(() => {
        console.log('Document downloaded successfully');
      })
      .catch((error) => {
        console.error('Error downloading document:', error);
      });
  };

  

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header/>
      <Container fluid className="py-5" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
      <Row className="m-5">
      <h2 className="text-center">Claim Documents</h2>
      </Row>
      <Row className="m-5">
      {documents.length > 0 ? (
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Document ID</th>
              <th>Document Type</th>
              <th>Document Name</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, index) => (
              <tr key={index}>
                <td>{doc.documentId}</td>
                <td>{doc.documentType}</td>
                <td>{doc.documentName}</td>
                <td>
                  <Button 
                    variant="primary" 
                    onClick={() => handleDownload(doc.documentId,doc.documentName)} 
                    disabled={!doc.documentId}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No documents available for this claim.</p>
      )}
      </Row>
      <Row className="m-5">
        <Col md={2}>
        <BackButton />
        </Col>
      </Row>
      </Container>
      <Footer />
    </Container>
  );
};

export default ClaimDocuments;