import React from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const navigate = useNavigate();

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

              />
            </Box>
            <Button 
          onClick={() => navigate('/home')}
          variant="contained" 
          sx={{width:'100%', marginTop: '32px', backgroundColor: '#ffcc80', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffa726' } }}
        >
          Login
        </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
