import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const yearlyData = {
  1: [
    { name: 'None', spending: 2000 },
    { name: 'Lithium-Ion', spending: 1200 },
    { name: 'Sodium-Ion', spending: 1500 },
  ],
  5: [
    { name: 'None', spending: 10000 },
    { name: 'Lithium-Ion', spending: 6000 },
    { name: 'Sodium-Ion', spending: 7500 },
  ],
  10: [
    { name: 'None', spending: 20000 },
    { name: 'Lithium-Ion', spending: 12000 },
    { name: 'Sodium-Ion', spending: 15000 },
  ],
};

const Savings = () => {
  const [yearRange, setYearRange] = useState(1); // Default range: 1 year

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setYearRange(newValue);
  };

  // Calculate the maximum spending value for the selected year range
  const maxSpending = Math.max(...yearlyData[yearRange].map(item => item.spending));
  const paddedMaxSpending = Math.ceil(maxSpending * 1.1); // Add 10% padding

  // Calculate the money saved for each battery type
  const savingsData = yearlyData[yearRange].map(item => ({
    name: item.name,
    saved: maxSpending - item.spending,
  }));

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      {/* Tabs for Year Range */}
      <Tabs value={yearRange} onChange={handleTabChange} centered>
        <Tab label="1 Year" value={1} />
        <Tab label="5 Years" value={5} />
        <Tab label="10 Years" value={10} />
      </Tabs>

      {/* Bar Chart */}
      <Box sx={{ height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={yearlyData[yearRange]}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[0, paddedMaxSpending]}
              label={{ value: 'Yearly Spending ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Bar dataKey="spending" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Dynamic Typography Label */}
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        Estimated Yearly Spending for {yearRange} {yearRange === 1 ? 'Year' : 'Years'}
      </Typography>

      {/* Spending Table */}
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table aria-label="spending savings table">
          <TableHead>
            <TableRow>
              <TableCell>Battery Type</TableCell>
              <TableCell align="right">Money Saved ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {savingsData.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.saved}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Savings;
