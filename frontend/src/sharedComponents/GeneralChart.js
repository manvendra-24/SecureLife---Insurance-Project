import React from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const GeneralChart = ({ type, data, options }) => {
  const chartMap = {
    bar: Bar,
    line: Line,
    pie: Pie,
  };

  const ChartComponent = chartMap[type];

  if (!ChartComponent) {
    return <div>Unsupported chart type: {type}</div>;
  }

  return <ChartComponent data={data} options={options} />;
};

export default GeneralChart;
