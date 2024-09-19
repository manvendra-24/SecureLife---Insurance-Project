import React from 'react';
import GeneralChart from '../../sharedComponents/GeneralChart'; 

const AgentEarnings = ({ commission, penalty }) => {
  const data = {
    labels: ['Commissions', 'Penalty'],
    datasets: [
      {
        data: [commission, penalty], 
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
        barThickness: 50, 
        maxBarThickness: 80, 
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, 
      },
      title: {
        display: true,
        text: 'Agent Earnings Overview (Commissions vs Penalty)',
        padding: {
          top: 10,   
          bottom: 30, 
        },
        font: {
          size: 25,  
        },
        color: '#000', 
        align: 'center', 
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: (commission > penalty) ? commission * 1.5 : penalty * 1.5,
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <GeneralChart type="bar" data={data} options={options} />
    </div>
  );
};

export default AgentEarnings;
