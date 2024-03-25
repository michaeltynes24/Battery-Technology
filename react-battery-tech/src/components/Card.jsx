import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const Card = () => {
    
    const divStyle = {
        "max-width": "18rem"
      };
    const container = {
        "max-width": "80%"
      };

  return ( 
  <>
    <div className ='container'>
    <div className="card border-success my-5" style ={divStyle}>
    <div className="card-header">Header</div>
        <div className="card-body text-success">
        <h5 className="card-title">Success card title</h5>
        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
        </div>
    </div>
    </div>
    



    </>

  )
}

export default Card