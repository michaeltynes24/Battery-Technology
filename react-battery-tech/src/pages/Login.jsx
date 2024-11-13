import React, { useState } from 'react';
import { TextField, Button, Typography, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const Login = ({ route, method }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post('/api/token/', { username, password });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            localStorage.setItem('username', username);
            console.log(ACCESS_TOKEN);
            console.log(REFRESH_TOKEN);

            navigate("/");
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Grid
                container
                spacing={0}
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '100vh' }}
            >
                <Grid item xs={8}>
                    <Paper elevation={3} style={{ borderRadius: '20px', padding: '20px' }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Login
                        </Typography>
                        <Box sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    label="Username"
                                    variant="standard"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Box>

                            <Box mb={2}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    variant="standard"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Box>

                            <Button
                                type="submit" // Use type="submit" so Enter key triggers the form submit
                                variant="contained"
                                sx={{
                                    width: '100%',
                                    marginTop: '32px',
                                    backgroundColor: '#ffcc80',
                                    color: '#000',
                                    fontWeight: 'bold',
                                    '&:hover': { backgroundColor: '#ffa726' }
                                }}
                            >
                                Login
                            </Button>
                        </Box>

                        <Link to='/newUser'>
                            <Typography sx={{ justifyContent: 'center', display: 'flex', mt: 2 }}>
                                New User? Sign Up
                            </Typography>
                        </Link>
                    </Paper>
                </Grid>
            </Grid>
        </form>
    );
};

export default Login;
