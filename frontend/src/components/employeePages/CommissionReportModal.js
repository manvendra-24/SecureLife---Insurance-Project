import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { getAllAgents } from '../../services/EmployeeService';
import { getCommissionByAgentId } from '../../services/EmployeeService';

const CommissionReportModal = ({ show, handleClose }) => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const params = { page: 0, size: 100 };  
        const response = await getAllAgents(params);
        setAgents(response.content);  
      } catch (error) {
        toast.error('Error fetching agents');
      }
    };

    fetchAgents();
  }, []);

  const handleGenerateReport = async () => {
    if (!selectedAgent) {
      toast.error("Please select an agent");
      return;
    }

    try {
      setLoading(true);
      const response = await getCommissionByAgentId(selectedAgent);
      setCommissions(response.content);  
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching commissions");
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg"> 
      <Modal.Header closeButton>
        <Modal.Title>Select Agent for Commission Report</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="agentSelect">
          <Form.Label>Select Agent</Form.Label>
          <Form.Control as="select" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            <option value="">Select Agent</option>
            {agents.map((agent) => (
              <option key={agent.agentId} value={agent.agentId}>
                {agent.name} ({agent.agentId})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {commissions.length > 0 && (
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Policy ID</th>
                <th>Plan ID</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Policy Term</th>
                <th>Total Investment</th>
                <th>Payment Interval</th>
                <th>Commission</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission) => (
                <tr key={commission.policyId}>
                  <td>{commission.policyId}</td>
                  <td>{commission.plan_id}</td>
                  <td>{new Date(commission.startDate).toLocaleDateString()}</td>
                  <td>{new Date(commission.endDate).toLocaleDateString()}</td>
                  <td>{commission.policyTerm}</td>
                  <td>{commission.totalInvestmentAmount}</td>
                  <td>{commission.paymentInterval}</td>
                  <td>{commission.commission}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleGenerateReport} disabled={loading}>
          {loading ? 'Loading...' : 'Generate Report'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommissionReportModal;
