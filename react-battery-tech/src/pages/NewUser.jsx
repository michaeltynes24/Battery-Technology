
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const NewUser = () => {
    const imgURL = "/node_modules/bootstrap-icons/icons/battery-half.svg";
    const customContainer = {
        "max-width": "400px",
    };
    const expandInputStyle = {
        "max-width": "300px",
        "display": "block",
    };
    const collapseInputStyle = {
        "max-width": "300px",
        "display": "none",
    };

    const [showExpandedInput, setShowExpandedInput] = useState(false);

    const expandInputs = (option) => {
        if (option === 'Other') {
            setShowExpandedInput(true);
        } else {
            setShowExpandedInput(false);
        }
    };

    return (
        <div className="container text-center">
            <h2 className='border-bottom pb-1'>Account Information</h2>

            {/* New User Form */}
            <form>
                <div className='container' style={customContainer}>

                    <div className="form-row">
                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="firstName">First Name</label>
                            <input type="text" className="form-control" id="firstName" placeholder="First Name" />
                        </div>


                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="lastName">Last Name</label>
                            <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
                        </div>
                    </div>


                    <div className="form-group mb-2">
                        <label className='mb-2' htmlFor="email">Email Address</label>
                        <input type="email" className="form-control" id="email" placeholder="Email Address" />
                    </div>



                    <div className="form-row">
                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="batteryType">Battery Type</label>
                            <select id="batteryType" className="form-control">
                                <option selected>Choose...</option>
                                <option>Lithium-ion</option>
                                <option>Lead Acid</option>
                                <option>Sodium-ion</option>
                                <option>Others</option>
                            </select>
                        </div>



                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="utilityCompany">Utility Company</label>
                            <select id="utilityCompany" className="form-control" onChange={(e) => expandInputs(e.target.value)}>
                                <option selected>Choose...</option>
                                <option value="SDGE">SDGE</option>
                                <option value="PGE">PGE</option>
                                <option value="Other">Other (enter utility information manually)</option>
                            </select>
                        </div>

                        <div className="form-group mb-2 text-start">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="importdata" />
                                <label className="form-check-label" htmlFor="importdata">
                                    Would you like to import your energy data? (SDGE & PGE only)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className='expandedInputs container' style={showExpandedInput ? expandInputStyle : collapseInputStyle}>
                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="summerSuperOffPeak">Summer Super Off Peak price</label>
                            <input type="text" className="form-control" id="ssofp" placeholder="$" />
                        </div>

                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="summerOffPeak">Summer Off peak price</label>
                            <input type="text" className="form-control" id="sofp" placeholder="$" />
                        </div>

                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="summerSuperOffPeak">Summer On Peak price</label>
                            <input type="text" className="form-control" id="sonp" placeholder="$" />
                        </div>
                       
                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="summerSuperOffPeak">Winter Super Off Peak price</label>
                            <input type="text" className="form-control" id="wsofp" placeholder="$" />
                        </div>                       
                       
                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="summerSuperOffPeak">Winter Off Peak price</label>
                            <input type="text" className="form-control" id="wofp" placeholder="$" />
                        </div>

                        <div className="form-group mb-2">
                            <label className='mb-2' htmlFor="summerSuperOffPeak">Winter On Peak price</label>
                            <input type="text" className="form-control" id="wonp" placeholder="$" />
                        </div>
                    </div>

                    <div className="form-row">
                        <label className='mb-2' htmlFor="batterySize">Battery Size</label><br />
                        <div className="form-group mb-2 ms-5">
                            <img src={imgURL} alt="" className='w-25 h-25' /> <br />
                            <input type="range" min="0" max="100" value="50" className="slider" id="myRange" />
                            <p>Value: <span id="sliderValue">50</span></p>
                        </div>

                        <div className="form-group mb-2 text-start">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="solar" />
                                <label className="form-check-label" htmlFor="solar">
                                    Do you have Solar? (check for yes)
                                </label>
                            </div>
                        </div>
                    </div>

                    <Link to='/home'>
                        <button type="submit" className="btn btn-primary mt-5">Submit</button>
                    </Link>

                </div>
            </form>
        </div>
    )
}

export default NewUser;
