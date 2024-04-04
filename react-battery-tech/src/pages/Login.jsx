import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  return (
   <>
   <div className = 'container-fluid'>
   < Link to = '/Home' className = 'btn btn-primary me-3' style = {{textDecoration:'none'}}>Login</Link> 
   < Link to = '/newUser' className = 'btn btn-primary' style = {{textDecoration:'none'}}>New User</Link> 

   </div>
   </>

  )
};

export default Login