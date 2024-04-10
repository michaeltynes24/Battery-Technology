import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


const Footer = () => {
    const divStyle = {
        "text-align": "center", 
        "padding": "20px", 
        "margin-top": "40px"
    };
    return (
    <>
    <footer className="bg-light absolute-bottom" style = {divStyle}>
      <p>Copyright &copy; 2024 Shine</p>
        <Link to ='/home'className = 'me-3'>Home</Link>
        <Link to ='/home'className = 'me-3' >About</Link>
        <Link to ='/home'className = 'me-3'>Team</Link>
        <Link to ='/home'className = 'me-3'>Contact</Link>
  </footer>
  </>
  )
}

export default Footer