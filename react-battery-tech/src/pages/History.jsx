import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import api from '../api';

const History = () => {
  const [selectedRange, setSelectedRange] = useState(0); // 0: 3 Months, 1: 6 Months, 2: 1 Year
  const [data, setData] = useState([]); // Raw data from backend
  const [processedData, setProcessedData] = useState([]); // Filtered data for selected range
  const [loading, setLoading] = useState(true);

  // Fetch aggregated energy data from the backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/uploaded_files/');
        const backendData = response.data.data || []; // Expecting aggregated data in 'data' field
        setData(backendData);
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

    const now = new Date();
    let filteredData;

    // Filter data based on the selected range
    switch (selectedRange) {
      case 0: // Last 3 months
        filteredData = data.filter(({ date }) => {
          const [year, month] = date.split('-');
          const rowDate = new Date(year, month - 1); // Convert year-month to Date
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          return rowDate >= threeMonthsAgo;
        });
        break;

      case 1: // Last 6 months
        filteredData = data.filter(({ date }) => {
          const [year, month] = date.split('-');
          const rowDate = new Date(year, month - 1);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return rowDate >= sixMonthsAgo;
        });
        break;

      case 2: // Last 1 year
        filteredData = data.filter(({ date }) => {
          const [year, month] = date.split('-');
          const rowDate = new Date(year, month - 1);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
          return rowDate >= oneYearAgo;
        });
        break;

      default:
        filteredData = data;
    }

    // Sort the filtered data by date
    filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));

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
