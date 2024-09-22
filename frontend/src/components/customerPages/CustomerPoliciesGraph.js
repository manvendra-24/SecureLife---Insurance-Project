import React, { useEffect, useState, useCallback } from 'react';
import { Carousel, Card } from 'react-bootstrap';
import GeneralChart from '../../sharedComponents/GeneralChart';
import { getMyPolicies } from '../../services/CustomerService';
import { FaExclamationTriangle } from 'react-icons/fa';
import Loader from '../../sharedComponents/Loader';

const CustomerPoliciesGraph = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(() => {
    const params = {
      page: 0,
      size: 10,
      sortBy: 'policyId',
      direction: 'DESC',
    };

    getMyPolicies(params)
      .then((responseData) => {
        setData(responseData.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the policies!', error);
        setError('Error in getting policies');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Loader/>;

  const getPaymentIntervalValue = (interval) => {
    switch (interval?.toLowerCase()) {
      case 'yearly':
        return 1;
      case 'half_yearly':
        return 2;
      case 'quarterly':
        return 4;
      default:
        return 1;
    }
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {data.length === 0 ? ( 
        <Card style={{ width: '80%', margin: 'auto', border: 'none', backgroundColor: 'rgba(230, 242, 255, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <FaExclamationTriangle size={50} color="orange" />
            <h5 style={{ margin: '10px 0' }}>No Data Available</h5>
            <p>Please purchase Policies</p>
          </div>
        </Card>
      ) : (
        <Carousel 
          indicators={false} 
          controls={true} 
          nextIcon={<span aria-hidden="true" className="carousel-control-next-icon" style={{ filter: 'invert(1)' }} />}
          prevIcon={<span aria-hidden="true" className="carousel-control-prev-icon" style={{ filter: 'invert(1)' }} />} 
        >
          {data.map((policy, index) => {
            const paymentIntervalValue = getPaymentIntervalValue(policy.paymentInterval);
            const totalInstallments = parseInt(paymentIntervalValue * policy.policyTerm, 10);

            const totalAmountPerInstallment = totalInstallments > 0 ? (policy.totalInvestmentAmount / totalInstallments) : 0;

            const installmentsPaid = (policy.totalAmountPaid > 0 && totalAmountPerInstallment > 0) 
              ? Math.floor(policy.totalAmountPaid / totalAmountPerInstallment) 
              : 0;

            const validInstallments = Math.max(1, installmentsPaid);
            const cumulativeAmounts = Array.from({ length: validInstallments }, (_, i) => totalAmountPerInstallment * (i + 1));

            const chartData = {
              labels: Array.from({ length: validInstallments }, (_, i) => `Installment ${i + 1}`),
              datasets: [
                {
                  label: 'Cumulative Amount Paid',
                  data: cumulativeAmounts,
                  backgroundColor: 'pink',
                  borderColor: 'red',
                  borderWidth: 2,
                  fill: false,
                  tension: 0.4,
                }
              ],
            };

            const options = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                },
                title: {
                  display: true,
                  padding: {
                    top: 10,
                    bottom: 30,
                  },
                  font: {
                    size: 20,
                  },
                  color: '#000',
                  align: 'center',
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Installments Paid',
                  },
                  beginAtZero: true,
                  ticks: {
                    precision: 0,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Cumulative Paid Amount',
                  },
                  beginAtZero: true,
                  min: 0,
                  suggestedMin: policy.totalAmountPaid > 0 ? policy.totalAmountPaid * 0.05 : 0,
                  max: policy.totalAmountPaid * 1.5,
                },
              },
            };

            return (
              <Carousel.Item key={index}>
                <Card style={{ width: '80%', margin: '0 auto', border: 'none', backgroundColor: 'rgba(230, 242, 255, 0.5)' }}>
                  <Card.Body>
                    <h5 className="text-center">Policy ID: {policy.policyId}</h5>
                    <div style={{ height: '300px', width: '100%' }}>
                      <GeneralChart type="line" data={chartData} options={options} />
                    </div>
                    <p>Total Paid Amount: {policy.totalAmountPaid}</p>
                    <p>Total Installments Paid: {installmentsPaid}</p>
                    <p>Total Investment Amount: {policy.totalInvestmentAmount}</p>
                    <p>Total Installments: {totalInstallments}</p>
                  </Card.Body>
                </Card>
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}
    </div>
  );
};

export default CustomerPoliciesGraph;
