import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
    localStorage.clear()
    return <Navigate to ='/login'/>
}

export default function App() {
  return (   
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<ProtectedRoute> 
                                    <Layout />
                                </ProtectedRoute> }> {/* parent route */}
        <Route index element ={<Home />} /> 
        <Route path="history" element={<History />} />
        <Route path="optimizer" element={<Optimizer />} />
        <Route path="profile" element={<Profile/>} />
        <Route path="savings" element={<Savings/>} />
        <Route path="team" element={<Team/>} />
        <Route path="contact" element={<Contact/>} />
        <Route path="*" element={<NoPage/>} /> {/* catches all unidentified routes*/}
      </Route>
      <Route path = "welcome" element ={<LandingPage />} /> 
      <Route path = "login" element ={<Login />} />
      <Route path = "newUser" element={<NewUser/>} />
      <Route path = "logout" element={<Logout/>} />



    </Routes>
  </BrowserRouter>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);