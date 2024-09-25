import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2'
import BarChartIcon from '@mui/icons-material/BarChart';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
    const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
      {/* Hero Section */}
      <Box sx={{ backgroundColor: 'rgb(255,180,0,0.7)', padding: '80px 16px', textAlign: 'center', color: 'white' }}>
        <Typography variant="h2" gutterBottom>
          Welcome to Shine Energy Management
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: '600px', margin: '0 auto' }}>
          Optimize your energy use, lower your bills, and embrace a greener future with Shine's energy management tools.
        </Typography>
        <Button 
          onClick={() => navigate('/login')}
          variant="contained" 
          sx={{ marginTop: '32px', backgroundColor: '#ffcc80', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffa726' } }}
        >
          Get Started
        </Button>

        

      </Box>

      {/* Features Section */}
      <Grid container spacing={4} sx={{ padding: '64px 16px', maxWidth: '1200px', margin: '0 auto' }}>
        <Grid item size = {{xs:12, sm:6, md:3}}>
          <Paper elevation={3} sx={{ padding: '32px', textAlign: 'center', borderRadius: '16px' }}>
            <BarChartIcon sx={{ fontSize: '64px', color: 'rgb(255,180,0,0.7)' }} />
            <Typography variant="h6" sx={{ marginTop: '16px' }}>
              Energy Optimizer
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '8px', color: '#757575' }}>
              Track, manage, and optimize your energy consumption in real-time.
            </Typography>
          </Paper>
        </Grid>
        <Grid size = {{xs:12, sm:6, md:3}}>
          <Paper elevation={3} sx={{ padding: '32px', textAlign: 'center', borderRadius: '16px' }}>
            <SolarPowerIcon sx={{ fontSize: '64px', color: 'rgb(255,180,0,0.7)' }} />
            <Typography variant="h6" sx={{ marginTop: '16px' }}>
              Renewable Integration
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '8px', color: '#757575' }}>
              Seamlessly integrate solar power and other renewable sources.
            </Typography>
          </Paper>
        </Grid>
        <Grid size = {{xs:12, sm:6, md:3}}>
          <Paper elevation={3} sx={{ padding: '32px', textAlign: 'center', borderRadius: '16px' }}>
            <AccountCircleIcon sx={{ fontSize: '64px', color: 'rgb(255,180,0,0.7)' }} />
            <Typography variant="h6" sx={{ marginTop: '16px' }}>
              Personalized Dashboard
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '8px', color: '#757575' }}>
              Access detailed reports and analytics tailored to your energy usage.
            </Typography>
          </Paper>
        </Grid>
        <Grid size = {{xs:12, sm:6, md:3}}>
          <Paper elevation={3} sx={{ padding: '32px', textAlign: 'center', borderRadius: '16px' }}>
            <LocalAtmIcon sx={{ fontSize: '64px', color: 'rgb(255,180,0,0.7)' }} />
            <Typography variant="h6" sx={{ marginTop: '16px' }}>
              Cost Savings
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '8px', color: '#757575' }}>
              Maximize savings by identifying opportunities to reduce energy costs.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Footer Section */}
    <Footer />
    </Box>
  );
};

export default LandingPage;
