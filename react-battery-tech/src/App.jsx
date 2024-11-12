import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import History from './pages/History';
import Optimizer from './pages/Optimizer';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import NoPage from './pages/NoPage';
import Layout from './pages/Layout';
import NewUser from './pages/NewUser';
import LandingPage from './pages/LandingPage';
import Team from './pages/Team';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';

function Logout() {
  localStorage.clear();
  return <Navigate to='/login' />;
}

export default function App() {
  const [settingsComplete, setSettingsComplete] = useState(false);

  // Check if settings are saved in localStorage
  useEffect(() => {
    const isConfigured = localStorage.getItem('settingsComplete');
    setSettingsComplete(isConfigured === 'true');
  }, []);

  // Handler for saving settings
  const handleSettingsSave = () => {
    localStorage.setItem('settingsComplete', 'true');
    setSettingsComplete(true);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="welcome" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />

        {/* New User Page */}
        <Route path="newUser" element={<NewUser onSave={handleSettingsSave} />} />

        {/* Main Application Routes */}
        {settingsComplete ? (
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="history" element={<History />} />
            <Route path="optimizer" element={<Optimizer />} />
            <Route path="profile" element={<Profile />} />
            <Route path="savings" element={<Savings />} />
            <Route path="team" element={<Team />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        ) : (
          // Redirect to NewUser if settings are not complete
          <Route path="*" element={<Navigate to="/newUser" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}
