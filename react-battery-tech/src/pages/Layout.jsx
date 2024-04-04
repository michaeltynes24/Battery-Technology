import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

const Layout = () => {
  return (
    <>
    {/* Head Logo */}
    <div className="text-center">
        <img src="../../docs/images/teamLogo.png" className="img-fluid py-2 border border-3 rounded-4 border-dark my-2" alt='' />
    </div>
    
    <Outlet />

    <Footer />




    </>

);
}

export default Layout