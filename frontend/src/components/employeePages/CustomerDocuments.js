import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Container, Button } from 'react-bootstrap';
import BackButton from '../../sharedComponents/BackButton';
import { downloadDocument, approveCustomer, rejectCustomer } from '../../services/EmployeeService';
import { successToast, errorToast } from '../../sharedComponents/MyToast';
import { ToastContainer } from 'react-toastify';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
const CustomerDocuments = () => {
  const location = useLocation();
  const { documents, customerId } = location.state || { documents: [], customerId: null }; 
  const navigate = useNavigate();

  const handleDownload = (documentId,documentName) => {
    downloadDocument(documentId,documentName)
      .then(() => {
        console.log('Document downloaded successfully');
        successToast("Document downloaded successfully");
      })
      .catch((error) => {
        console.error('Error downloading document:', error);
      });
  };

  const handleApprove = () => {
    approveCustomer(customerId)
      .then(() => {
        console.log('Customer approved successfully');
        successToast("Customer Approved Succussfully!")
        setTimeout(()=>{navigate('/SecureLife.com/employee/customers');},2000)
      })
      .catch((error) => {
        console.error('Error approving customer:', error);
        errorToast("Failed to Approve Customer")
      });
  };

  const handleReject = () => {
    rejectCustomer(customerId)
      .then(() => {
        console.log('Customer rejected successfully');
        successToast('Customer rejected successfully!');
        setTimeout(()=>{navigate('/view-customers');},2000)
      })
      .catch((error) => {
        console.error('Error rejecting customer:', error);
        errorToast('Failed to reject customer.');
      });
  };

  return (
    <Container fluid className="d-flex flex-column min-vh-100 px-0">
      <Header/>
      <Container fluid className="py-5" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
      <h2 className="text-center">Customer Documents</h2>
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
        <p className="text-center">No documents available for this customer.</p>
      )}

     
      <div className="d-flex justify-content-center mt-4">
        <Button variant="success" className="me-3" onClick={handleApprove} disabled={!customerId}>
          Approve
        </Button>
        <Button variant="danger" onClick={handleReject} disabled={!customerId}>
          Reject
        </Button>
      </div>
      
      <BackButton />
      <ToastContainer/>
    </Container>
    <Footer/>
    </Container>
  );
};

export default CustomerDocuments;
