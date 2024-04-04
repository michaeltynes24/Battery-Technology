import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import History from './pages/History';
import Optimizer from './pages/Optimizer';
import Profile from './pages/Profile';
import Savings from './pages/Savings';
import NoPage from './pages/NoPage';
import Layout from './pages/Layout';
import NewUser from './pages/NewUser';


export default function App() {
  return (   
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}> {/* parent route */}
        <Route index element ={<Login />} />
        <Route path= "home" element ={<Home />} /> 
        <Route path="history" element={<History />} />
        <Route path="optimizer" element={<Optimizer />} />
        <Route path="profile" element={<Profile/>} />
        <Route path="savings" element={<Savings/>} />
        <Route path="newUser" element={<NewUser/>} />
        <Route path="*" element={<NoPage/>} /> {/* catches all unidentified routes*/}
      </Route>
    </Routes>
  </BrowserRouter>

  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);