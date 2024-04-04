import React from 'react'
import { Link } from 'react-router-dom'



const NewUser = () => {
    //********Troubleshoot ***********/
    // let slider = document.getElementById("myRange");
    // let output = document.getElementById("sliderValue");
    // output.innerHTML = slider.value;

    // slider.oninput = function() {
    //   output.innerHTML = this.value;
    // }

    const imgURL = "/node_modules/bootstrap-icons/icons/battery-half.svg"
    const customContainer =  {
        "max-width": "400px",
    }

  return (
    <div className="container text-center">
    <h2 className ='border-bottom pb-1'>Account Information</h2>
    
    {/* New User Form */}
    <form>
    <div className = 'container' style = {customContainer}>
      
      <div className="form-row">
        <div className="form-group mb-2">
          <label className = 'mb-2' for="firstName">First Name</label>
          <input type="text" className="form-control" id="firstName" placeholder="First Name"/>
        </div>
      
      
        <div className="form-group mb-2">
          <label className = 'mb-2' for="lastName">Last Name</label>
          <input type="text" className="form-control" id="lastName" placeholder="Last Name"/>
        </div>
      </div>
      
      
      <div className="form-group mb-2">
        <label className = 'mb-2' for="email">Email Address</label>
        <input type="email" className="form-control" id="email" placeholder="Email Address"/>
      </div>
      
      
      
      <div className="form-row">
        <div className="form-group mb-2">
          <label className = 'mb-2' for="batteryType">Battery Type</label>
          <select id="batteryType" className="form-control">
            <option selected>Choose...</option>
            <option>Lithium-ion</option>
            <option>Lead Acid</option>
            <option>Sodium-ion</option>

            <option>Others</option>
          </select>
        </div>
        
        
        
        <div className="form-group mb-2">
          <label className = 'mb-2' for="utilityCompany">Utility Company</label>
          <select id="utilityCompany" className="form-control">
            <option selected>Choose...</option>
            <option>SDGE</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      
      
      
      <div className="form-row">
          <label className = 'mb-2' for="batterySize">Battery Size</label><br />
          <div className="form-group mb-2 ms-5">
          <img src={imgURL} alt="" className ='w-25 h-25' /> <br />
            <input type="range" min="0" max="100" value="50" className="slider" id="myRange" />
            <p>Value: <span id="sliderValue">50</span></p>
        </div>
        
        
        
        <div className="form-group mb-2 text-start">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="solar"/>
            <label className="form-check-label" for="solar">
               Solar?
            </label>
          </div>
        </div>
      </div>
      
      
      
      <Link to ='/home'>
        <button type="submit" className="btn btn-primary mt-5">Submit</button>
      </Link>
      
      
      </div>
    </form>



  </div>
  )
}

export default NewUser