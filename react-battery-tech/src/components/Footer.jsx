import * as React from 'react';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

const Footer = () => {
  return (
    <Box sx={{alignContent:'flex-end',width: '100%', backgroundColor: 'transparent', padding: '16px', textAlign: 'center' }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={12}>
          <Typography variant="body2" color="textSecondary">
            Copyright &copy; 2024 Shine
          </Typography>
        </Grid>

        <Grid size={12}>
          <Link to="/home" style={{ textDecoration: 'none', marginRight: '16px' }}>
            <Typography sx={{ font:'body', color: 'darkgrey', '&:hover': { color: 'orange' }, display: 'inline-block' }}>
              Home
            </Typography>
          </Link>

          <Link to="/about" style={{ textDecoration: 'none', marginRight: '16px' }}>
            <Typography sx={{ font:'body', color: 'darkgrey', '&:hover': { color: 'orange' }, display: 'inline-block' }}>
              About
            </Typography>
          </Link>

          <Link to="/team" style={{ textDecoration: 'none', marginRight: '16px' }}>
            <Typography sx={{ font:'body', color: 'darkgrey', '&:hover': { color: 'orange' }, display: 'inline-block' }}>
              Team
            </Typography>
          </Link>

          <Link to="/contact" style={{ textDecoration: 'none', marginRight: '16px' }}>
            <Typography sx={{ font:'body', color: 'darkgrey', '&:hover': { color: 'orange' }, display: 'inline-block' }}>
              Contact
            </Typography>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Footer;
