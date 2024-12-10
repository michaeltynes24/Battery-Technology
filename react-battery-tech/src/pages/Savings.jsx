import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Tabs, Tab, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ACCESS_TOKEN } from '../constants';


const Savings = () => {
    const [savings, setSavings] = useState([]);
    const token = localStorage.getItem(ACCESS_TOKEN);
    // Define yearly data structure
    const yearlyData = {
        1: [
            { name: 'None', spending: Math.round(savings.noBattery * 100) / 100 },
            { name: 'Lithium-Ion', spending: Math.round(savings.LI_spending * 100) / 100 },
            { name: 'Sodium-Ion', spending: Math.round(savings.NA_spending * 100) / 100 },
        ],
        5: [
            { name: 'None', spending: Math.round(savings.noBattery * 5 * 100) / 100 },
            { name: 'Lithium-Ion', spending: Math.round(savings.LI_spending * 5 * 100) / 100 },
            { name: 'Sodium-Ion', spending: Math.round(savings.NA_spending * 5 * 100) / 100 },
        ],
        10: [
            { name: 'None', spending: Math.round(savings.noBattery * 10 * 100) / 100 },
            { name: 'Lithium-Ion', spending: Math.round(savings.LI_spending * 10 * 100) / 100 },
            { name: 'Sodium-Ion', spending: Math.round(savings.NA_spending * 10 * 100) / 100 },
        ],
    };

    const [yearRange, setYearRange] = useState(1); // Default range: 1 year

    // Fetch data when the component mounts
    useEffect(() => {
        console.log(token)
        fetch("http://127.0.0.1:8081/api/savings/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 

            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data); // For debugging, you can remove this later
                setSavings(data);
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []); // Empty dependency array ensures the fetch is called only once when the component mounts

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setYearRange(newValue);
    };

    // Calculate the maximum spending value for the selected year range
    const maxSpending = Math.max(...yearlyData[yearRange].map(item => item.spending));
    const paddedMaxSpending = Math.ceil(maxSpending / 100) * 110; // Add 10% padding

    // Calculate the money saved for each battery type
    const savingsData = yearlyData[yearRange].map(item => ({
        name: item.name,
        saved: Math.round((maxSpending - item.spending) * 100) / 100,
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
