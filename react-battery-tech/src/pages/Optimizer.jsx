import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import api from '../api';

function fillData(utility) {
  const data = [
    { time: '00:00', percentage: utility === "SDGE" ? 40 : 40 },
    { time: '02:00', percentage: utility === "SDGE" ? 60 : 70 },
    { time: '03:00', percentage: utility === "SDGE" ? 70 : 90 },
    { time: '04:00', percentage: utility === "SDGE" ? 80 : 95 },
    { time: '06:00', percentage: utility === "SDGE" ? 85 : 100 },
    { time: '08:00', percentage: utility === "SDGE" ? 90 : 100 },
    { time: '10:00', percentage: utility === "SDGE" ? 95 : 100 },
    { time: '12:00', percentage: utility === "SDGE" ? 100 : 100 },
    { time: '14:00', percentage: utility === "SDGE" ? 100 : 100 },
    { time: '16:00', percentage: utility === "SDGE" ? 100 : 100 },
    { time: '18:00', percentage: utility === "SDGE" ? 70 : 70 },
    { time: '20:00', percentage: utility === "SDGE" ? 40 : 40 },
    { time: '21:00', percentage: utility === "SDGE" ? 10 : 10 },
    { time: '22:00', percentage: utility === "SDGE" ? 20 : 20 },
    { time: '23:00', percentage: utility === "SDGE" ? 30 : 30 },
    { time: '24:00', percentage: utility === "SDGE" ? 40 : 40 },
  ];

  // Create chargingData based on the percentage increase/decrease
  const chargingData = [];
  
  // Compare the first two entries
  if (data.length > 1) {
    const firstStatus = data[1].percentage > data[0].percentage ? 'Charging' : 'Discharging';
    chargingData.push({ time: data[0].time, status: firstStatus });
  }

  let previousStatus = chargingData.length > 0 ? chargingData[0].status : null;

  data.forEach((row, index) => {
    if (index === 0) {
      // Skip the first row since it's already handled
      return;
    }

    const prevRow = data[index - 1];
    const status = row.percentage > prevRow.percentage ? 'Charging' : 'Discharging';

    // Only add entry if the status has changed
    if (status !== previousStatus) {
      chargingData.push({ time: row.time, status });
      previousStatus = status;
    }
  });

  return { data, chargingData }; // Return both data and chargingData
}

const Optimizer = () => {
  const username = localStorage.getItem('username');
  const [utility, setUtility] = useState('');
  const [data, setData] = useState([]);
  const [chargingData, setChargingData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run the effect once on mount

  const fetchData = () => {
    api
      .get(`/api/userextension/?username=${username}`)
      .then((res) => res.data)
      .then((data) => {
        setUtility(data[0].utility);
        console.log(data[0].utility);
        // Call fillData and update both data and chargingData states
        const { data: newData, chargingData: newChargingData } = fillData(data[0].utility);
        setData(newData);
        setChargingData(newChargingData);
      })
      .catch((err) => alert(err));
  };

  return (
    <Grid container sx={{ minHeight: '100vh', maxHeight: '150vh', backgroundColor: 'transparent', paddingY: '5%' }}>
      <Typography sx={{ fontSize: 40, mb: 10, borderBottom: 'solid', width: '100%', justifyContent: 'center', display: 'flex' }}>
        Optimizer Tool
      </Typography>
      <Grid size={12} sx={{ height: '100%', marginBottom: '100px' }}>
        {/* Line Chart */}
        <Box sx={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" label={{ value: 'Time of Day', position: 'insideBottomRight', offset: -10 }} />
              <YAxis domain={[0, 100]} label={{ value: 'Charge (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="percentage" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Grid>

      {/* Table */}
      <Grid size={12} sx={{ height: '100%' }}>
        <Box sx={{ height: '50%', width: '100%', backgroundColor: 'lightgrey', padding: '20px', display: 'flex' }}>
          <TableContainer component={Paper}>
            <Table aria-label="charging discharging times table">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chargingData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      {row.time}
                    </TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Optimizer;
