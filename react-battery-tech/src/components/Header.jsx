import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Logo from '../../docs/images/teamLogo.png';
import  Grid  from '@mui/material/Grid2';

const Header = () => {
  return (
    <>  
      {/* <Box sx={{ flexGrow: 1, width:'100%', height:'100%', backgroundColor:'orange'}}> */}
        <AppBar position="static" elevation={1} sx = {{ backgroundColor:'lightgrey', color:'black'}}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left: Name*/}
            <Grid size ={2}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Shine
            </Typography>
            </Grid>

            {/* Center: Image */}
            <Grid size ={8}>
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <img src={Logo} alt="Logo" style={{ height: '60px',margin:'10px' }} />
            </Box>
            </Grid>

            {/* Right: Login Button */}
            <Grid size ={2} sx = {{justifyContent:'flex-end' , display:'flex'}}>
                <Button color="inherit">Login</Button>
            </Grid>
          </Toolbar>
        </AppBar>
      {/* </Box>  */}
    </>
  );
};

export default Header;
