import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Checkbox, FormControlLabel, Slider } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const NewUser = (props) => {
    // fetch data only when props.title is passed in(meaning user is on profile page, not new user page)
    useEffect(() => {
        if (props.title) {
            fetchData();
        }
    }, [props.title]);

    const fetchData = () => {
        api
            .get('/api/userextension/')
            .then((res) => res.data)
            .then((data) => {
                setData(data);
                console.log(data)
            })
            .catch((err) => alert(err));
    };
    const [data,setData] = useState([])
    const title = "New User Account";
    const [showExpandedInput, setShowExpandedInput] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [importGreenButton, setImportGreenButton] = useState(false);
    const [solar, setSolar] = useState(false);
    const [summerOnPeak, setSummerOnPeak] = useState("");
    const [summerSuperOffPeak, setSummerSuperOffPeak] = useState("");
    const [summerOffPeak, setSummerOffPeak] = useState("");
    const [winterOnPeak, setWinterOnPeak] = useState("");
    const [winterSuperOffPeak, setWinterSuperOffPeak] = useState("");
    const [winterOffPeak, setWinterOffPeak] = useState("");
    const [batterySize, setBatterySize] = useState(50); // State for slider
    const [batterytype, setBatteryType] = useState('');
    const [loading, setLoading] = useState(false);
    const[utility, setUtility] = useState("")
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        // send registration info
        try {
            const res = await api.post('/api/user/register/', { username, password,email,first_name,last_name })   
            const res2 = await api.post('/api/userextension/', { username, utility,importGreenButton,solar,
                                                    summerSuperOffPeak,summerOffPeak,summerOnPeak,
                                                    winterSuperOffPeak,winterOffPeak,winterOnPeak,
                                                    batterySize,batterytype })
            navigate("/login")
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
        }
    };


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

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="First Name" variant="outlined" fullWidth
                                value={first_name} 
                                onChange={(e) => setFirstName(e.target.value)}/>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="Last Name" variant="outlined" fullWidth
                                value={last_name} 
                                onChange={(e) => setLastName(e.target.value)}/>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="Username" variant="outlined" fullWidth
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)}/>
                </FormControl>

                
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="Password" variant="outlined" fullWidth
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}/>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 3 }}>
                    <TextField label="Email Address" variant="outlined" fullWidth
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}/>
                </FormControl>

                {/* Battery Type Dropdown */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Battery Type</InputLabel>
                    <Select defaultValue="" label="Battery Type" value={batterytype} onChange={(e) => setBatteryType(e.target.value)}>
                        <MenuItem value="">Choose...</MenuItem>
                        {/* <MenuItem value="None">None</MenuItem> */}
                        <MenuItem value="Lithium-ion">Lithium-ion</MenuItem>
                        <MenuItem value="Sodium-ion">Sodium-ion</MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                    </Select>
                </FormControl>

                {/* Utility Company Dropdown */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Utility Company</InputLabel>
                    <Select defaultValue="" label="Utility Company" value={utility} onChange={(e) => setUtility(e.target.value)}>
                        <MenuItem value="">Choose...</MenuItem>
                        <MenuItem value="SDGE">SDGE</MenuItem>
                        <MenuItem value="PGE">PGE</MenuItem>
                        <MenuItem value="Other">Other (enter utility information manually)</MenuItem>
                    </Select>
                </FormControl>

                {/* Import Data Checkbox */}
                <FormControlLabel
                    control={<Checkbox value = {importGreenButton} onChange={(e) => setImportGreenButton(e.target.checked)}/>}
                    label="Would you like to import your energy data? (SDGE & PGE only)"
                    sx={{ mb: 3 }}
                />

                {/* Expanded Inputs */}
                {showExpandedInput && (
                    <Box sx={{ mb: 3 }}>
                        <TextField value={summerSuperOffPeak} onChange = {(e) => setSummerSuperOffPeak(e.target.value)}label="Summer Super Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField value={summerOffPeak} onChange = {(e) => setSummerOffPeak(e.target.value)}label="Summer Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField value={summerOnPeak} onChange = {(e) => setSummerOnPeak(e.target.value)}label="Summer On Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField value={winterSuperOffPeak} onChange = {(e) => setWinterSuperOffPeak(e.target.value)}label="Winter Super Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField value={winterOffPeak} onChange = {(e) => setWinterOffPeak(e.target.value)}label="Winter Off Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
                        <TextField value={winterOnPeak} onChange = {(e) => setWinterOnPeak(e.target.value)}label="Winter On Peak price" fullWidth variant="outlined" sx={{ mb: 3 }} />
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
                    control={<Checkbox value = {solar} onChange={(e) => setSolar(e.target.checked)} />}
                    label="Do you have Solar? (check for yes)"
                    sx={{ mb: 3 }}
                />

                {/* Submit Button */}
                    <Button type='submit'variant="contained" fullWidth sx={{ mt: 3, backgroundColor:'#ffcc80',  fontWeight: 'bold', '&:hover': { backgroundColor: '#ffa726' } }}>
                        {props.title ? "Save" : "Submit"}
                    </Button>
            </form>
        </Box>
    );
}

export default NewUser;
