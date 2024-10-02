import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
const teamMembers = [
  {
    name: 'Alex Rivera (Team Leader)',
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem eveniet inventore ipsum distinctio minima suscipit temporibus sit vero, quam laudantium earum tempore veritatis, dignissimos doloribus exercitationem aspernatur sint laboriosam? Odit ducimus dolorem consectetur eaque deserunt iusto velit. Obcaecati, inventore, harum quod soluta quidem sunt explicabo, pariatur officiis quisquam rem amet!",
    image: 'https://via.placeholder.com/150', // Replace with actual image URL
  },
  {
    name: 'Michael Tynes',
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem eveniet inventore ipsum distinctio minima suscipit temporibus sit vero, quam laudantium earum tempore veritatis, dignissimos doloribus exercitationem aspernatur sint laboriosam? Odit ducimus dolorem consectetur eaque deserunt iusto velit. Obcaecati, inventore, harum quod soluta quidem sunt explicabo, pariatur officiis quisquam rem amet!",
    image: 'https://via.placeholder.com/150', // Replace with actual image URL
  },
  {
    name: 'Steven Busse',
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem eveniet inventore ipsum distinctio minima suscipit temporibus sit vero, quam laudantium earum tempore veritatis, dignissimos doloribus exercitationem aspernatur sint laboriosam? Odit ducimus dolorem consectetur eaque deserunt iusto velit. Obcaecati, inventore, harum quod soluta quidem sunt explicabo, pariatur officiis quisquam rem amet!",
    image: 'https://via.placeholder.com/150', // Replace with actual image URL
  },
  {
    name: 'Maria Dawood',
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem eveniet inventore ipsum distinctio minima suscipit temporibus sit vero, quam laudantium earum tempore veritatis, dignissimos doloribus exercitationem aspernatur sint laboriosam? Odit ducimus dolorem consectetur eaque deserunt iusto velit. Obcaecati, inventore, harum quod soluta quidem sunt explicabo, pariatur officiis quisquam rem amet!",
    image: 'https://via.placeholder.com/150', // Replace with actual image URL
  },
  {
    name: 'Vishal Kipadia',
    bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem eveniet inventore ipsum distinctio minima suscipit temporibus sit vero, quam laudantium earum tempore veritatis, dignissimos doloribus exercitationem aspernatur sint laboriosam? Odit ducimus dolorem consectetur eaque deserunt iusto velit. Obcaecati, inventore, harum quod soluta quidem sunt explicabo, pariatur officiis quisquam rem amet!",
    image: 'https://via.placeholder.com/150', // Replace with actual image URL
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
