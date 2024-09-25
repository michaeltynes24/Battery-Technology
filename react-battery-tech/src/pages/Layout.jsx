import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import Header from '../components/Header';

const Layout = () => {
  return (
    <>
      
      <Grid container sx = {{backgroundColor:'transparent', width:'100%', minHeight:'120vh'}}>

      {/* //container for the header */}
                <Box sx ={{maxHeight:'20px', width:'100%'}}>
                    <Header/>
                </Box>
    {/* //container for rest of the content */}
            <Grid size = {12} sx = {{backgroundColor:'transparent', minHeight:'80vh',paddingX:{xs:'10%',md:'20%'}}}>
                <Box sx = {{width:'100%', height:'100%',backgroundColor:'transparent'}}>
                    <Outlet />
                </Box>
            </Grid>
        
        <Footer />
        </Grid>

        







    </>

);
}

export default Layout