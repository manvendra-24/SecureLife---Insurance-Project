import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getPoliciesByCustomerId } from '../../services/EmployeeService'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ViewPolicyReportModal = ({ show, handleClose }) => {
  const [customerId, setCustomerId] = useState('');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!customerId) {
      toast.error("Please enter a Customer ID");
      return;
    }

    try {
      setLoading(true);
      const params = { page: 0, size: 100 }; 
      const response = await getPoliciesByCustomerId(customerId, params); 
      setPolicies(response.content);
      setLoading(false);
    } catch (error) {
      handleClose();
      toast.error("Give a valid customerId");
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text(`Policy Report for Customer ID: ${customerId}`, 14, 16);

    doc.autoTable({
      startY: 22,
      head: [['Policy ID', 'Start Date', 'End Date', 'Policy Term', 'Total Investment', 'Payment Interval', 'Status']],
      body: policies.map(policy => [
        policy.policyId,
        new Date(policy.startDate).toLocaleDateString(),
        new Date(policy.endDate).toLocaleDateString(),
        policy.policyTerm,
        policy.totalInvestmentAmount,
        policy.paymentInterval,
        policy.status,
      ]),
    });

    doc.save(`Policy_Report_${customerId}.pdf`);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Search Policy by Customer ID</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="customerIdSearch">
          <Form.Label>Enter Customer ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Customer ID"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSearch} disabled={loading} className="mt-3">
          {loading ? 'Searching...' : 'Search'}
        </Button>

        {policies.length > 0 && (
          <>
            <Table striped bordered hover className="mt-4">
              <thead>
                <tr>
                  <th>Policy ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Policy Term</th>
                  <th>Total Investment</th>
                  <th>Payment Interval</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.policyId}>
                    <td>{policy.policyId}</td>
                    <td>{new Date(policy.startDate).toLocaleDateString()}</td>
                    <td>{new Date(policy.endDate).toLocaleDateString()}</td>
                    <td>{policy.policyTerm}</td>
                    <td>{policy.totalInvestmentAmount}</td>
                    <td>{policy.paymentInterval}</td>
                    <td>{policy.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Button variant="success" onClick={downloadPDF} className="mt-3">
              Download PDF
            </Button>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewPolicyReportModal;
