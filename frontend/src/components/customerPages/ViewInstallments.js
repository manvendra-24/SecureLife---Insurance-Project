import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { getPolicyById as getMyPolicybyId, getTransactionsByPolicyId, downloadReceipt } from '../../services/CustomerService';
import TableData from '../../sharedComponents/TableData';
import Loader from '../../sharedComponents/Loader';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { ToastContainer } from 'react-toastify';
import { verifyCustomer } from '../../services/AuthService';
import { errorToast, successToast } from '../../sharedComponents/MyToast';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CalculateAmountModal from './CalculateAmountModal';
import PaymentProcessModal from './PaymentProcessModal';
import BackButton from '../../sharedComponents/BackButton';

const stripePromise = loadStripe('pk_test_51PvdKL2NU6rbBnm1jk4JxyiyT2PbF3CWvlAAjrFscZhwSAdUd01zmHgxeEonuaYSOdGtVmXr84oBUui6Jq2S1W5p00PIroyxe1');


const ViewInstallmentTable = () => {
  const [isCustomer, setIsCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [installmentData, setInstallmentData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const { policyId } = useParams();
  const [policy, setPolicy] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showCalculateModal, setShowCalculateModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(null);
  const [nextPendingInstallmentId, setNextPendingInstallmentId] = useState(null);

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
    if (policy && transactionData.length >= 0) {
      generateInstallments();
    }
  }, [policy, transactionData]);

  const generateInstallments = () => {
    const { totalInvestmentAmount, paymentInterval, policyTerm } = policy;
    const intervalMultiplier = getInterval(paymentInterval);
    const installmentAmount = totalInvestmentAmount / (policyTerm * intervalMultiplier);

    if (installmentAmount && intervalMultiplier > 0 && policyTerm > 0) {
      const totalInstallments = policyTerm * intervalMultiplier;
      const newInstallments = [];

      for (let i = 1; i <= totalInstallments; i++) {
        const transactionIndex = i - 1;
        const transactionExists = transactionData.length > transactionIndex;

        
        newInstallments.push({
          installmentId: i,
          installmentAmount: installmentAmount.toFixed(2),
          transactionId: transactionExists ? transactionData[transactionIndex]?.transactionId || "N/A" : "N/A",
          transactionDate: transactionExists ? transactionData[transactionIndex]?.date || "N/A" : "N/A",
          transactionAmount: transactionExists ? transactionData[transactionIndex]?.amount || "N/A" : "N/A",
          transactionStatus: transactionExists ? transactionData[transactionIndex]?.status || "PENDING" : "PENDING",
        });
      }

      setInstallmentData(newInstallments);
const nextInstallment = newInstallments.find((installment) => installment.transactionStatus === "PENDING");
setNextPendingInstallmentId(nextInstallment ? nextInstallment.installmentId : null);
console.log('Next pending installment: ', nextPendingInstallmentId);
} else {
console.error('One of the required policy fields is missing');
}
};

const handleDownloadReceipt = async (transactionId) => {
try {
await downloadReceipt(transactionId);
successToast('Receipt downloaded successfully!');
} catch (error) {
console.error('Error downloading receipt:', error);
errorToast('Failed to download receipt.');
}
};

const getInterval = (interval) => {
switch (interval) {
case 'QUARTERLY':
  return 4;
case 'HALF_YEARLY':
  return 2;
case 'YEARLY':
  return 1;
default:
  return 0;
}
};

const fetchData = useCallback(async () => {
try {
const fetchedPolicy = await getMyPolicybyId(policyId);
console.log('Fetched Policy: ', fetchedPolicy);
setPolicy(fetchedPolicy);
} catch (error) {
console.error('Error fetching policy:', error);
setError(error);
errorToast('Failed to load policy details');
} finally {
setLoading(false);
}
}, [policyId]);

const fetchTransactions = useCallback(async () => {
try {
const transactions = await getTransactionsByPolicyId(policyId);
console.log('Fetched Transactions: ', transactions);
setTransactionData(transactions);
} catch (error) {
console.error('Error fetching transactions:', error);
errorToast('Failed to load transactions');
}
}, [policyId]);

useEffect(() => {
if (isCustomer) {
fetchData();
fetchTransactions();
}
}, [fetchData, fetchTransactions, isCustomer]);

const handleCalculateModal = (installment) => {
setSelectedInstallment(installment);
setShowCalculateModal(true);
};

const handleProceedToPayment = (totalAmount) => {
setCalculatedAmount(totalAmount);
setShowCalculateModal(false);
setShowPaymentModal(true);
};

const handleClosePaymentModal = () => {
setShowPaymentModal(false);
};

if (loading) return <Loader />;

return (
<Elements stripe={stripePromise}>
<Container fluid className="d-flex flex-column min-vh-100 px-0">
  <Header/>
    <Container fluid className="py-5 px-5" style={{backgroundColor:'rgba(230, 242, 255, 0.5)'}}>
    <Row className="m-5">
          <Col md={8}>
            <h2>My Installment</h2> 
          </Col>
        </Row>
        <Row className="m-5">
          <Col md={6}>
          <h3>Policy Id: {policyId}</h3>
          </Col>
          </Row>

      {installmentData.length > 0 && (
        <Row className="m-5">
          <TableData
            data={installmentData}
            isViewInstallmentTable={true}
            onPayment={(installment) => {
              if (installment) {
                handleCalculateModal(installment);
              } else {
                console.error('Installment data is missing or undefined.');
              }
            }}
            nextPendingInstallmentId={nextPendingInstallmentId}
            downloadReceipt={handleDownloadReceipt}
          />
        </Row>      
)}

        <Row className="m-5">  
            <Col md={12} style={{ textAlign: 'right' }}>
              <BackButton />
            </Col>
        </Row>
    </Container>
  <Footer />
  <ToastContainer />
  {selectedInstallment && (
          <>
            <CalculateAmountModal
              show={showCalculateModal}
              handleClose={() => setShowCalculateModal(false)}
              installmentAmount={selectedInstallment}
              onProceed={handleProceedToPayment}
            />
            <PaymentProcessModal
              show={showPaymentModal}
              handleClose={handleClosePaymentModal}
              fetchData = {fetchTransactions}
              installmentAmount={calculatedAmount}
              policyId={policyId}
            />
          </>
        )}
      </Container>
    </Elements>
  );
};

export default ViewInstallmentTable;