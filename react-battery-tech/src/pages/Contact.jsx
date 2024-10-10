import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send data to an API)
    console.log('Form submitted:', formData);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Contact Us
      </Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Message"
            name="message"
            variant="outlined"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            required
          />
        <Button 
          onClick={() => navigate('/')}
          variant="contained" 
          sx={{ marginTop: '32px', backgroundColor: '#ffcc80', color: '#000', fontWeight: 'bold', '&:hover': { backgroundColor: '#ffa726' } }}
        >
          Send Message
        </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Contact;
