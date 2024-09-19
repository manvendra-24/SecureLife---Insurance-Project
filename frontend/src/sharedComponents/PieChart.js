import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, ArcElement } from 'chart.js';
import { Row, Col, ListGroup } from 'react-bootstrap';

ChartJS.register(Tooltip, Legend, ArcElement);

const PieChart = ({ data }) => {
  const generateColors = (count) => {
    const baseColors = [
      'rgba(255, 99, 132, 0.6)',
      'rgba(54, 162, 235, 0.6)',
      'rgba(255, 206, 86, 0.6)',
      'rgba(75, 192, 192, 0.6)',
      'rgba(153, 102, 255, 0.6)',
      'rgba(255, 159, 64, 0.6)',
    ];
    return baseColors.slice(0, count);
  };

  const labels = data.map(item => item.label);
  const values = data.map(item => item.value);

  const colors = generateColors(labels.length);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(color => color.replace('0.6', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Row className="m-5">
      <Col xs={12} md={6}>
        <Pie data={chartData} options={options} />
      </Col>
      <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
        <ListGroup>
          {data.map((item, index) => (
            <ListGroup.Item key={index} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: colors[index],
                  borderRadius: '50%',
                  marginRight: '10px',
                }}
              ></div>
              <span>{item.label}: {item.value}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Col>
    </Row>
  );
};

export default PieChart;
