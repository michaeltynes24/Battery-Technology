import React from 'react'
import Card from './Card'

const CardStack = () => {

  const divStyle = {
    "max-width": "50rem"
  };
  const container = {
    "max-width": "80%"
  };


  return (
    
    <>
  <div className ='container' style= {divStyle}>

  <div class="row">
    <div class="col-md-6">
        <Card imgURL = '/node_modules/bootstrap-icons/icons/bar-chart-line-fill.svg' cardName = "Optimizer" path = '/optimizer'/>
    </div>
    <div class="col-md-6">
        <Card imgURL = '/node_modules/bootstrap-icons/icons/sunset-fill.svg' cardName = "Energy Use History"path = '/history' />
    </div>
  </div>
  <div class="row">
    <div class="col-md-6">
        <Card imgURL = '/node_modules/bootstrap-icons/icons/person-bounding-box.svg' cardName = "Profile" path = '/profile' />
    </div>
    <div class="col-md-6">
        <Card imgURL = '/node_modules/bootstrap-icons/icons/cash-stack.svg' cardName = "Potential Savings" path = '/savings' />
    </div>
  </div>
  </div>

    </>
  )
}

export default CardStack