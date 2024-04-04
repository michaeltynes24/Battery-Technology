import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  return (
   <>
   <div className = 'container-fluid'>
   < Link to = '/Home' className = 'btn btn-primary' style = {{textDecoration:'none'}}>Login</Link> 
   </div>
   </>

  )
};

export default Login