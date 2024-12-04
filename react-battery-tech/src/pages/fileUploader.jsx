import React, { useState, useEffect} from 'react';
import { Box, Button, Typography, Input } from '@mui/material';
import api from '../api';


const fileUploader = () => {
    const [file, setFile] = useState(null);
    const [uploadedFile,setUploadedFile] = useState(null);
    const [uploadedFiles,setUploadedFiles] = useState(null);
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
            setUploadedFile(file.name);
            alert("File uploaded successfully!");
        } catch (error) {
            if (error.response.data) {
                alert(error.response.data.error);
            }
            else {
                alert("Failed to upload the file.");
                console.log(error)    
            }
            console.log(error)
        }
    };

    useEffect(() => {
        const fetchUploadedFiles = async () => {
            try {
                const response = await api.get('/api/uploaded_files/');
                console.log(response);
                setUploadedFiles(response.data.files || []);
            } catch (error) {
                console.error('Error fetching uploaded files:', error);
            }
        };
        fetchUploadedFiles();
    }, []);
    return (
        <>
        
        <Box sx={{ textAlign: 'center', mt: 0, mb:5 }}>
            <Typography variant="h5">Upload Energy Data CSV File</Typography>
            {uploadedFile && <p>Uploaded file: {uploadedFile}</p>}
            {uploadedFiles && uploadedFiles.length > 0 && (
                <div>
                <p>Previously uploaded files:</p>
                <ul>
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>{file}</li>
                    ))}
                </ul>
            </div>
            )}

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