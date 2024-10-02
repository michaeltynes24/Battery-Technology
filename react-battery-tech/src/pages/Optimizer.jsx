import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const data = [
  { time: '00:00', percentage: 30 },
  { time: '02:00', percentage: 40 },
  { time: '04:00', percentage: 50 },
  { time: '06:00', percentage: 70 },
  { time: '08:00', percentage: 60 },
  { time: '10:00', percentage: 80 },
  { time: '12:00', percentage: 90 },
  { time: '14:00', percentage: 100 },
  { time: '16:00', percentage: 80 },
  { time: '18:00', percentage: 70 },
  { time: '20:00', percentage: 60 },
  { time: '22:00', percentage: 40 },
];

// Define chargingData
const chargingData = [
  { time: '00:00', status: 'Charging' },
  { time: '06:00', status: 'Discharging' },
  { time: '08:00', status: 'Charging' },
  { time: '14:00', status: 'Discharging' },
  { time: '22:00', status: 'Charging' },
];

const Optimizer = () => {
  return (
    <Grid container sx={{ minHeight: '100vh', maxHeight:'150vh', backgroundColor: 'transparent', paddingY:'5%' }}>
    <Typography sx={{fontSize:40, mb:10,borderBottom:'solid', width:'100%',justifyContent:'center', display:'flex'}}>
        Optimizer Tool
    </Typography>
      <Grid size = {12} sx={{height:'100%', marginBottom:'100px'}}>
      {/* Line Chart */}
      <Box sx={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
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
      <Grid size = {12} sx={{height:'100%'}}>
      <Box sx={{ height: '50%', width: '100%', backgroundColor: 'lightgrey', padding:'20px', display:'flex'}}>
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
