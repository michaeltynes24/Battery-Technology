import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
// Mock data for each range
const data3Months = [
  { month: 'Feb', kWh: 120 },
  { month: 'Mar', kWh: 150 },
  { month: 'Apr', kWh: 130 },
];

const data6Months = [
  { month: 'Nov', kWh: 110 },
  { month: 'Dec', kWh: 140 },
  { month: 'Jan', kWh: 100 },
  { month: 'Feb', kWh: 120 },
  { month: 'Mar', kWh: 150 },
  { month: 'Apr', kWh: 130 },
];

const data1Year = [
  { month: 'May', kWh: 95 },
  { month: 'Jun', kWh: 115 },
  { month: 'Jul', kWh: 140 },
  { month: 'Aug', kWh: 125 },
  { month: 'Sep', kWh: 160 },
  { month: 'Oct', kWh: 130 },
  { month: 'Nov', kWh: 110 },
  { month: 'Dec', kWh: 140 },
  { month: 'Jan', kWh: 100 },
  { month: 'Feb', kWh: 120 },
  { month: 'Mar', kWh: 150 },
  { month: 'Apr', kWh: 130 },
];

const History = () => {
  // State to track selected time range
  const [selectedRange, setSelectedRange] = useState(0);

  // Select data based on the selected tab
  const getData = () => {
    switch (selectedRange) {
      case 0:
        return data3Months;
      case 1:
        return data6Months;
      case 2:
        return data1Year;
      default:
        return data3Months;
    }
  };

  // Get the range label for the Typography component
  const getRangeLabel = () => {
    switch (selectedRange) {
      case 0:
        return 'Feb 2024 - Apr 2024';
      case 1:
        return 'Nov 2023 - Apr 2024';
      case 2:
        return 'May 2023 - Apr 2024';
      default:
        return '';
    }
  };

  return (
    <Grid container sx ={{height:'100vh', paddingTop:'5%',backgroundColor:'transparent'}}>
    <Typography sx={{fontSize:40, mb:5,borderBottom:'solid', width:'100%',justifyContent:'center', display:'flex'
    }}>
        Energy Use History
    </Typography>
    <Box sx={{ width: '100%', padding: 2}}>
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
        <ResponsiveContainer>
          <BarChart
            data={getData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottomRight', offset: -5 }} />
            <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="kWh" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Box>

      {/* Range Label */}
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 2 }}>
        {getRangeLabel()}
      </Typography>
    </Box>
    </Grid>
  );
};

export default History;
