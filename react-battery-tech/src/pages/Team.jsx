import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Alex from '../../../files/Alex.png'
import Vishal from '../../../files/Vishal.png'
import Michael from '../../../files/Michael.png'
import Maria from '../../../files/Maria.png'
import Steven from '../../../files/Steven.png'


const teamMembers = [
  {
    name: 'Alex Rivera (Team Leader)',
    bio: "Escondido CA, San Diego State University - Computer Engineering, Backend Development Team, After graduation Alex will be working at LPL Financial as a Change Management Engineer.",
    image: Alex,
  },
  {
    name: 'Michael Tynes',
    bio: "Denver CO, San Diego State University - Computer Engineering Front/Backend Development Team After graduation Michael will continue as an Aviation Electronics Technician before upgrading into an engineering role.",
    image: Michael
    },
  {
    name: 'Steven Busse',
    bio: " Glendora CA, San Diego State University - Computer Engineering, Backend Development Team After graduation Steven will be continuing his job at Renewable Energy Solutions as a Renewable Applications Engineer.",
    image: Steven,
  },
  {
    name: 'Maria Dawood',
    bio: "San Diego CA, San Diego State University - Electrical Engineering, Backend Development Team, After graduation Maria will be continuing to work at Helix Electric as a Project Engineer",
    image: Maria,
  },
  {
    name: 'Vishal Kipadia',
    bio: "San Diego CA, San Diego State University - Computer Engineering, Frontend Development Team, After graduation Vishal will continue his education to a masters degree in Computer Engineering",
    image: Vishal,
  },
];

const Team = () => {
  return (
    <Box sx={{ p: 3, mt:5}}>
      <Typography variant="h4" align="center" sx={{ mb: 4,pb:5, borderBottom:'solid' }}>
        Meet Our Team
      </Typography>
      <Grid container spacing={4}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ display: 'flex', p: 2 }}>
              <Box
                component="img"
                src={member.image}
                alt={member.name}
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  mr: 2,
                }}
              />
              <Box>
                <Typography variant="h6">{member.name}</Typography>
                <Typography variant="body1">{member.bio}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Team;
