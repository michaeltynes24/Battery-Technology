import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Checkbox, FormControlLabel, Slider } from '@mui/material';
const NewUser = (props) => {
    const title = "New User Account";
    const [showExpandedInput, setShowExpandedInput] = useState(false);
    const [batterySize, setBatterySize] = useState(50); // State for slider

    const expandInputs = (option) => {
        if (option === 'Other') {
            setShowExpandedInput(true);
        } else {
            setShowExpandedInput(false);
        }
    };

    return (
        <Box sx={{ maxWidth: '80%', mx: 'auto', mt:7, mb:3 }}>
            <Typography sx = {{justifyContent:'center', display:'flex'}}variant="h4" gutterBottom>{props.title ? props.title : title}</Typography>

            {/* New User Form */}

            <form>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="First Name" variant="outlined" fullWidth />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="Last Name" variant="outlined" fullWidth />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="Username" variant="outlined" fullWidth />
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="Email Address" variant="outlined" fullWidth />
                </FormControl>

                {/* Battery Type Dropdown */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Battery Type</InputLabel>
                    <Select defaultValue="" label="Battery Type">
                        <MenuItem value="">Choose...</MenuItem>
                        <MenuItem value="Lithium-ion">Lithium-ion</MenuItem>
                        <MenuItem value="Sodium-ion">Sodium-ion</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                    </Select>
                </FormControl>

                {/* Utility Company Dropdown */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Utility Company</InputLabel>
                    <Select defaultValue="" label="Utility Company" onChange={(e) => expandInputs(e.target.value)}>
                        <MenuItem value="">Choose...</MenuItem>
                        <MenuItem value="SDGE">SDGE</MenuItem>
                        <MenuItem value="PGE">PGE</MenuItem>
                        <MenuItem value="Other">Other (enter utility information manually)</MenuItem>
                    </Select>
                </FormControl>

                {/* Import Data Checkbox */}
                <FormControlLabel
                    control={<Checkbox />}
                    label="Would you like to import your energy data? (SDGE & PGE only)"
                    sx={{ mb: 3 }}
                />

                {/* Expanded Inputs */}
                {showExpandedInput && (
                    <Box sx={{ mb: 3 }}>
                        <TextField label="Summer Super Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField label="Summer Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField label="Summer On Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField label="Winter Super Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField label="Winter Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField label="Winter On Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                    </Box>
                )}

                {/* Battery Size Slider */}
                <Box sx={{ mb: 3 }}>
                    <Typography gutterBottom>Current Battery Size (Slide to 0 if N/A)</Typography>
                    <Slider
                    sx={{color:'#ffa726'}}
                        value={batterySize}
                        onChange={(e, value) => setBatterySize(value)}
                        min={0}
                        max={100}
                        aria-labelledby="battery-size-slider"
                        valueLabelDisplay="auto"
                        
                    />
                    <Typography>Size in kWh: {batterySize}</Typography>
                </Box>

                {/* Solar Checkbox */}
                <FormControlLabel
                    control={<Checkbox />}
                    label="Do you have Solar? (check for yes)"
                    sx={{ mb: 3 }}
                />

                {/* Submit Button */}
                <Link to='/home' style={{ textDecoration: 'none' }}>
                    <Button variant="contained" fullWidth sx={{ mt: 3, backgroundColor:'#ffcc80',  fontWeight: 'bold', '&:hover': { backgroundColor: '#ffa726' } }}>
                        {props.title ? "Save" : "Submit"}
                    </Button>
                </Link>
            </form>
        </Box>
    );
}

export default NewUser;
