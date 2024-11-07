import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
// import FilledInput from '@mui/material/FilledInput';
// import FormControl from '@mui/material/FormControl';
// import FormHelperText from '@mui/material/FormHelperText';
// import Input from '@mui/material/Input';
// import InputLabel from '@mui/material/InputLabel';
// import OutlinedInput from '@mui/material/OutlinedInput';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';



const Login = () => {
    const navigate = useNavigate();
    const[email,SetEmail] = useState('');
    const[password,SetPassword] = useState('');

    const handleClick = async () => {
        try {
          // Send POST request to backend
          const response = await axios.post("http://your-backend-url.com/api/endpoint", {
            email: email,
            password: password
          });
    
          // Handle the response if needed
          console.log("Data sent successfully:", response.data);
        } catch (error) {
          console.error("Error sending data:", error);
        }
      };

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item size={8}>
        <Paper elevation={3} style={{ borderRadius: '20px', padding: '20px' }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form noValidate autoComplete="off" style={{color:'transparent'}}>
          <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1 } }}
      noValidate
      autoComplete="off"
    >
            <Box mb={2}>
              <TextField
                fullWidth
                label="Email"
                variant="standard"
                type="email"
                required
                value = {email}
                onChange = {(e) => SetEmail(e.target.value)}

              />
            </Box>

    </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                label="Password"
                variant="standard"
                type="password"
                required
                value = {password}
                onChange = {(e) => SetPassword(e.target.value)}

              />
            </Box>
            <Button 
        //   onClick={() => navigate('/home')}
          onClick = {handleClick}
          variant="contained" 
          sx={{width:'100%', marginTop: '32px', backgroundColor: '#ffcc80', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffa726' } }}
        >
          Login
        </Button>
        <Link to = '/newUser'>
            <Typography sx = {{justifyContent:'center', display:'flex',mt:2}}>
                New User? Sign Up
            </Typography>
        </Link>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
