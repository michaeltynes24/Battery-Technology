import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import "chart.js/auto";

const History = () => {
// for sample chart
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Battery Usage',
      data: [200, 120, 250, 130, 260, 180, 200, 220, 240, 260, 280, 300], // Sample savings data for each month
      backgroundColor: ['#00FF80'], // Background color for the chart
      borderColor: '#ffffff', // Border color for the chart
      borderWidth: 1,
    },
  ],
};
  

  return (
    <>
{/* for sample chart */}
    <div className = 'container text-center'>
      {/* <Bar data = {chartData} /> */}
      <div className = 'mb-4'>
      <h2 className = 'border-bottom pb-3'>Daily Energy Usage</h2>
        <img className = 'mb-5' src="../../docs/images/EnergyUsageGraph2.png" alt="" />
      <h2 className = 'border-bottom pb-3'> Yearly Energy Usage</h2>
        <img className = 'mb-5' src="../../docs/images/EnergyUsageGraph.png" alt="" />
        </div>
    </div>


    </>

  );
}

export default History