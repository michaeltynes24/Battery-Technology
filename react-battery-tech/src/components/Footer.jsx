import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';


const Footer = () => {
    const divStyle = {
        "text-align": "center", 
        "padding": "20px", 
        "margin-top": "40px"
    };
    return (
    <>
    <footer className="bg-light absolute-bottom" style = {divStyle}>
      <p>Copyright &copy; 2024 VAM2S SolarShine</p>
        <a href="#" className="px-1">Home</a>
        <a href="#" className="px-1">About</a>
        <a href="#" className="px-1">Team</a>
        <a href="#" className="px-1">Contact</a>

  </footer>
  </>
  )
}

export default Footer