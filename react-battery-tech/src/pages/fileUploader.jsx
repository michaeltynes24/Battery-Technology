import React, { useState } from 'react';
import { Box, Button, Typography, Input } from '@mui/material';
import api from '../api';


const fileUploader = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file!");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post('/api/upload_csv/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("File uploaded successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to upload the file.");
            console.log(error)
        }
    };

    return (
        <>
        
        <Box sx={{ textAlign: 'center', mt: 0, mb:5 }}>
            <Typography variant="h5">Upload Energy Data CSV File</Typography>
            <Input type="file" accept=".csv" onChange={handleFileChange} sx={{ mt: 3 }} />
            <Button 
                variant="contained" 
                onClick={handleUpload} 
                sx={{ mt: 2, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' } }}>
                Upload
            </Button>
        </Box>
        </>
    );
};
    
export default fileUploader