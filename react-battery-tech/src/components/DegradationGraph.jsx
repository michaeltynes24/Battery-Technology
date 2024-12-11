import React from 'react';
import { Line } from 'react-chartjs-2';
import { Container, Typography, Box } from '@mui/material';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const DegradationGraph = () => {
  // Constants for the degradation formula
  const C0 = 150; // Initial capacity (e.g., 150%)
  const k = 0.002; // Degradation rate (per cycle, a small value)
  
  // Generate degradation data using the formula: C(t) = C0 * (1 - k * t)
  const degradationData = Array.from({ length: 101 }, (_, index) => C0 * (1 - k * index));
  
  // Generate step data by setting values at every 10th cycle
  const stepData = degradationData.map((value, index) => (index % 10 === 0 ? value : null));

  // Chart.js data object
  const data = {
    labels: Array.from({ length: 101 }, (_, index) => index),  // Time/Cycles (0 to 100)
    datasets: [
      {
        label: 'Degradation Graph',
        data: degradationData,
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        fill: true,
        tension: 0.4,  // Smooth curve
      },
      {
        label: 'Step Graph',
        data: stepData,
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.3)',
        fill: false,
        borderDash: [5, 5],  // Dashed line
        tension: 0,  // No smooth curve
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Battery Degradation and Step Graph Over Time',
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time/Cycles',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Battery Capacity (%)',
        },
      },
    },
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5" align="center" gutterBottom>
          Battery Degradation Graph
        </Typography>
        <Line data={data} options={options} />
      </Box>
    </Container>
  );
};

export default DegradationGraph;
