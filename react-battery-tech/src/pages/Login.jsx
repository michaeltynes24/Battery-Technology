import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';


const Login = ({route,method}) => {
    const navigate = useNavigate();
    const[email,SetEmail] = useState('');
    const[username,setUsername] = useState('');
    const[password,SetPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post('/api/token/', { username, password })
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
        } catch (error) {
            alert(error)
        } finally {
            setLoading(false)
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
                label="Username"
                variant="standard"
                type="username"
                required
                value = {username}
                onChange = {(e) => setUsername(e.target.value)}

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
          onClick = {handleSubmit}
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
