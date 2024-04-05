import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const Card = (props) => {
    const imgURL = "/node_modules/bootstrap-icons/icons/person-bounding-box.svg"
    const cardName = ""


  return ( 
  <>

    <div className="card border-success my-5">

    <Link to = {props.path} style = {{textDecoration:'none', color:'#00a552'}}>
        <div className="card-body text-success text-center">
        <h5 className="card-title"></h5>
        <img src={props.imgURL ? props.imgURL : imgURL} alt="Bootstrap" width="128" height="128"></img>
        </div>
      <div className="card-header text-center fw-bold">{props.cardName ? props.cardName : cardName }</div>
    </Link>
    
    </div>

    </>

  )
}

export default Card