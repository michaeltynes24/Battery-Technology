import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';



const Savings = () => {

  const customContainer = {
    "max-width": "350px"
  };


  return (
    <>
    <div className = 'container text-center'>
      <div className = 'mb-4'>
      <h2 className = 'border-bottom pb-3 mb-5'>Your Potential Savings</h2>
        <h4 className = 'mb-4'>Yearly Spending Comparison</h4>
          <img className = 'mb-5' src="../../docs/images/costComparison.png" alt="" />
          <h5 className = 'border-bottom pb-3'>Best Option: Lithium Ion (~$2545.16 per year)</h5>
            <p className = 'text-success fw-bold'>Savings over next year: ~$449.15</p>
            <p className = 'text-success fw-bold'>Savings over next 5 years: ~$2,245.75</p>
            <p className = 'text-success fw-bold'>Savings over next 10 years: ~$4491.50</p>
          <div className = 'container text-center' style = {customContainer}>
            <Link to = '/optimizer'><button className = 'btn btn-primary p-2 px-5'>Back to Optimizer</button></Link>
          </div>
      </div>
    </div>
    </>
  )
}

export default Savings