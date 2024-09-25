import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const Optimizer = () => {
  const customContainer = {
    "max-width": "350px"
  };

  return (
    <>
    <p>optimizer</p>
    {/* <div className = 'container text-center'>
      <div className = 'mb-4'>
      <h2 className = 'border-bottom pb-3'>Your Optimized Routine</h2>
        <h4>Charge and Discharge over 24 Hour period</h4>
          <img className = 'mb-5' src="../../docs/images/chargeDischarge.png" alt="" />
          <h5>Charging Periods:</h5>
          <div className = 'container text-center' style = {customContainer}>
              <ol className = 'mb-5'>
                <li><p>12am-3pm (0:00-15:00)</p></li>
                <li><p>9pm-12am (21:00-00:00)</p></li>
              </ol>   
            <h5>Discharging Periods:</h5>
              <ol className = 'mb-5'>  
                <li><p>3pm-9pm (15:00-21:00)</p></li>  
              </ol>
            <Link to = '/savings'><button className = 'btn btn-primary p-2 px-5'>View Potential Savings With This Schedule</button></Link>
          </div>
      </div>
    </div> */}
    </>
  )
}

export default Optimizer