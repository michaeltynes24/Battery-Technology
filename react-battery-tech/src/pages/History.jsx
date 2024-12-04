import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import api from '../api';

const History = () => {
  const [selectedRange, setSelectedRange] = useState(0);  // 0: 3 Months, 1: 6 Months, 2: 1 Year
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/uploaded_files/');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Process data based on selected range
  useEffect(() => {
    if (!data.length) return;

    // Group data by year-month (e.g., "2024-01" for January 2024)
    const groupedData = data.reduce((acc, row) => {
      const date = new Date(row.date);
      const yearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      acc[yearMonth] = acc[yearMonth] ? acc[yearMonth] + parseFloat(row.net) : parseFloat(row.net);
      return acc;
    }, {});

    // Convert grouped data into an array of objects
    const aggregatedData = Object.entries(groupedData).map(([yearMonth, net]) => ({
      date: yearMonth, // Store the "year-month" format
      net,
    }));

    // Get current date for range filtering
    const now = new Date();
    let filteredData;

    // Filter based on the selected range
    switch (selectedRange) {
        case 0: // Last 3 months
          filteredData = aggregatedData.filter(({ date }) => {
            const [year, month] = date.split('-');
            const rowDate = new Date(year, month - 1); // Convert year-month to Date
            const threeMonthsAgo = new Date(); // Get the current date
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3); // Subtract 3 months
            return rowDate >= threeMonthsAgo;
          });
          break;
      
        case 1: // Last 6 months
          filteredData = aggregatedData.filter(({ date }) => {
            const [year, month] = date.split('-');
            const rowDate = new Date(year, month - 1); // Convert year-month to Date
            const sixMonthsAgo = new Date(); // Get the current date
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6); // Subtract 6 months
            return rowDate >= sixMonthsAgo;
          });
          break;
      
        case 2: // Last 1 year
          filteredData = aggregatedData.filter(({ date }) => {
            const [year, month] = date.split('-');
            const rowDate = new Date(year, month - 1); // Convert year-month to Date
            const oneYearAgo = new Date(); // Get the current date
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); // Subtract 1 year
            return rowDate >= oneYearAgo;
          });
          break;
      
        default:
          filteredData = aggregatedData;
      }
      
    // Sort data by date (year-month)
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Set the processed data
    setProcessedData(filteredData);
  }, [data, selectedRange]);

  // Get range display label
  const getRangeDisplayLabel = () => {
    switch (selectedRange) {
      case 0:
        return 'Last 3 Months';
      case 1:
        return 'Last 6 Months';
      case 2:
        return 'Last 1 Year';
      default:
        return '';
    }
  };



  return (
    <Grid container sx={{ height: '100vh', paddingTop: '5%', backgroundColor: 'transparent' }}>
      <Typography sx={{ fontSize: 40, mb: 5, borderBottom: 'solid', width: '100%', justifyContent: 'center', display: 'flex' }}>
        Energy Use History
      </Typography>
      <Box sx={{ width: '100%', padding: 2 }}>
        {/* Tabs for selecting the range */}
        <Tabs value={selectedRange} onChange={(e, newValue) => setSelectedRange(newValue)} centered>
          <Tab label="3 Months" />
          <Tab label="6 Months" />
          <Tab label="1 Year" />
        </Tabs>

        {/* Bar Chart */}
        <Box sx={{ width: '100%', height: '70%', marginTop: 2 }}>
          {loading ? (
            <Typography sx={{ textAlign: 'center', marginTop: 2 }}>Loading data...</Typography>
          ) : (
            <ResponsiveContainer>
              <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Net (kWh)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="net" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>

        {/* Range Label */}
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
          {getRangeDisplayLabel()}
        </Typography>
      </Box>
    </Grid>
  );
};

export default History;
