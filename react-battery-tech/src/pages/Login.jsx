import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = (props) => {
  const title = "Login to your Account";
  const customContainer = {
      "max-width": "400px",
  };
  return (
    <div className = 'container-fluid text-center'>

      <h2 className='border-bottom pb-1'>{props.title ? props.title : title}</h2>

      <form>
        <div className='container' style={customContainer}>
        
          <div className='form-group mb-2'>
            <label className='mb-2' htmlFor='email'>Email Address</label>
            <input type='email' className='form-control' id='email' placeholder='Email Address' />
          </div>

          
        </div>
      </form>

   < Link to = '/Home' className = 'btn btn-primary me-3' style = {{textDecoration:'none'}}>Login</Link> 
   < Link to = '/newUser' className = 'btn btn-primary' style = {{textDecoration:'none'}}>New User</Link> 

   </div>

  )
};

export default Login