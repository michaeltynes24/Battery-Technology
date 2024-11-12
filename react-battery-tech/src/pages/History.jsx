import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import axios from 'axios';

const History = () => {
  const [selectedRange, setSelectedRange] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data based on the selected range
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const range = getRangeLabel();
        const response = await axios.get(`http://localhost:8080/api/energy-history?range=${range}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, [selectedRange]);

  // Get label for each time range
  const getRangeLabel = () => {
    switch (selectedRange) {
      case 0:
        return '3Months';
      case 1:
        return '6Months';
      case 2:
        return '1Year';
      default:
        return '';
    }
  };

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
        <Tabs
          value={selectedRange}
          onChange={(e, newValue) => setSelectedRange(newValue)}
          centered
        >
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
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="kWh" fill="#82ca9d" />
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

