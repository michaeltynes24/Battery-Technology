import * as React from 'react';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SolarPowerIcon from '@mui/icons-material/SolarPower';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

const Home = () => {
  const navigate = useNavigate();

  // Update the cards array to include the icon component
  const cards = [
    { title: 'Optimizer', icon: <BarChartIcon sx={{ fontSize: '100%', width: '100%', height: '100%' }} />, path: '/optimizer' },
    { title: 'Energy Use History', icon: <SolarPowerIcon sx={{ fontSize: '100%', width: '100%', height: '100%' }} />, path: '/history' },
    { title: 'Profile', icon: <AccountCircleIcon sx={{ fontSize: '100%', width: '100%', height: '100%' }} />, path: '/profile' },
    { title: 'Potential Savings', icon: <LocalAtmIcon sx={{ fontSize: '100%', width: '100%', height: '100%' }} />, path: '/savings' },
  ];

  return (
    <>
      <Grid container spacing={2} sx={{ height: '100%', justifyContent: 'flex-start', alignContent: 'center' }}>
        {cards.map((card, index) => (
          <Grid size={6} key={index}>
            <Button sx = {{'&:hover': {
          backgroundColor: 'rgb(255,180,0,0.4)',}, borderRadius:'20px'}}onClick={() => navigate(card.path)} fullWidth>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                '& > :not(style)': {
                  m: 1,
                  width: 280,
                  height: 220,
                },
              }}>
                <Paper elevation={3} sx={{borderRadius:'20px'}}>
                  <Grid container sx={{ height: '100%' }}>
                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', height: '80%' }}>
                      {card.icon} 
                    </Grid>
                    <Grid size={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Typography sx={{fontWeight:'bold'}}>{card.title}
                        </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </Button> 
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
