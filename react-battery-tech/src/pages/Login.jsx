import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
    <nav>
      <ul>
        <li>
          <Link to="/optimizer">Home</Link>
        </li>
        <li>
          <Link to="/savings">Savings</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/history">History</Link>
        </li>
      </ul>
    </nav>

    <Outlet />
  </>

  )
};

export default Login