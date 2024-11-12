import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const Optimizer = () => {
  const [chargeData, setChargeData] = useState([]);
  const [chargingData, setChargingData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const chargeResponse = await axios.get('http://localhost:8080/api/optimizer/charge');
        const chargingStatusResponse = await axios.get('http://localhost:8080/api/optimizer/status');

        setChargeData(chargeResponse.data);
        setChargingData(chargingStatusResponse.data);
      } catch (error) {
        console.error("Error fetching optimizer data:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Grid container sx={{ minHeight: '100vh', maxHeight: '150vh', backgroundColor: 'transparent', paddingY: '5%' }}>
      <Typography sx={{ fontSize: 40, mb: 10, borderBottom: 'solid', width: '100%', justifyContent: 'center', display: 'flex' }}>
        Optimizer Tool
      </Typography>
      
      {/* Line Chart for Charge Percentage */}
      <Grid item xs={12} sx={{ height: '100%', marginBottom: '100px' }}>
        <Box sx={{ width: '100%', height: 400 }}>
          {loading ? (
            <Typography sx={{ textAlign: 'center', marginTop: 2 }}>Loading data...</Typography>
          ) : (
            <ResponsiveContainer>
              <LineChart
                data={chargeData}
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
          )}
        </Box>
      </Grid>

      {/* Charging and Discharging Status Table */}
      <Grid item xs={12} sx={{ height: '100%' }}>
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

