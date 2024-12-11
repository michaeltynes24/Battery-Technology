import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Container, Typography, Box, Button } from "@mui/material";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Import the zoom plugin
import zoomPlugin from "chartjs-plugin-zoom";

// Register Chart.js components and plugins
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const DegradationGraph = () => {
  const [isLogarithmic, setIsLogarithmic] = useState(true); // State to toggle axis type

  // Constants for the degradation formula
  const C0 = 100; // Initial battery capacity (%)
  const totalCycles = 6000; // Total cycles for 20% degradation
  const k = 0.20 / totalCycles; // Degradation rate per cycle

  // Generate degradation data using the formula: C(t) = C0 * (1 - k * t)
  const degradationData = Array.from({ length: totalCycles + 1 }, (_, t) => C0 * (1 - k * t));

  // Chart.js data object
  const data = {
    labels: Array.from({ length: totalCycles + 1 }, (_, t) => t), // X-axis: cycles
    datasets: [
      {
        label: "Battery Capacity",
        data: degradationData,
        borderColor: "orange",
        backgroundColor: "rgba(255, 165, 0, 0.3)",
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  // Chart.js options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Battery Degradation Over Time (${isLogarithmic ? "Logarithmic" : "Linear"} X-Axis)`,
        font: { size: 18 },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x", // Pan along X-axis only
        },
        zoom: {
          wheel: {
            enabled: true, // Enable zoom on mouse wheel
          },
          pinch: {
            enabled: true, // Enable zoom via pinch (touchscreen)
          },
          mode: "x", // Zoom only in X direction
        },
        limits: {
          x: { min: 1, max: totalCycles }, // Prevent zooming outside cycle range
        },
      },
    },
    scales: {
      x: {
        type: isLogarithmic ? "logarithmic" : "linear", // Toggle between logarithmic and linear
        title: {
          display: true,
          text: `Cycles (${isLogarithmic ? "Logarithmic" : "Linear"} Scale)`,
        },
        ticks: {
          callback: (value) => value.toLocaleString(), // Format tick labels
        },
      },
      y: {
        title: {
          display: true,
          text: "Battery Capacity (%)",
        },
        min: 80, // Set Y-axis minimum to 80%
        max: 100, // Set Y-axis maximum to 100%
      },
    },
  };

  // Toggle handler
  const toggleAxisType = () => {
    setIsLogarithmic((prev) => !prev);
  };

  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h5" align="center" gutterBottom>
          Battery Degradation Graph with {isLogarithmic ? "Logarithmic" : "Linear"} X-Axis
        </Typography>
        <Box display="flex" justifyContent="center" mb={2}>
          <Button variant="contained" color="primary" onClick={toggleAxisType}>
            Switch to {isLogarithmic ? "Linear" : "Logarithmic"} Scale
          </Button>
        </Box>
        <Line data={data} options={options} />
      </Box>
    </Container>
  );
};

export default DegradationGraph;
