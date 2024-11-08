import * as React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../../docs/images/teamLogo.png';
import Grid from '@mui/material/Grid2';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
        navigate('/logout')
    }

  return (
    <>
      <AppBar position="static" elevation={1} sx={{ backgroundColor: 'lightgrey', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Conditionally render based on current path */}
          {location.pathname === '/home' ? (
            // Left: Show Typography "Shine" on /home page
            <Grid size={5}>
              <Typography variant="h6" fontSize={15} component="div" sx={{ flexGrow: 1 }}>
                Shine - Empowering a sustainable future by optimizing the energy of today."
              </Typography>
            </Grid>
          ) : (
            // Left: Show Tabs on other pages
            <Grid size={5}>
              <Tabs value={location.pathname}>
              <Tab label="Home" value="/home" component={Link} to="/home" />
                <Tab label="Optimizer" value="/optimizer" component={Link} to="/optimizer" />
                <Tab label="History" value="/history" component={Link} to="/history" />
                <Tab label="Profile" value="/profile" component={Link} to="/profile" />
                <Tab label="Savings" value="/savings" component={Link} to="/savings" />
              </Tabs>
            </Grid>
          )}

          {/* Center: Image */}
          <Grid size={2}>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <img src={Logo} alt="Logo" style={{ height: '60px', margin: '10px' }} />
            </Box>
          </Grid>

          {/* Right: Login Button */}
          <Grid size={5} sx={{ justifyContent: 'flex-end', display: 'flex' }}>
            <Button onClick= {handleLogout} color="inherit">Logout</Button>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
