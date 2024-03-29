import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const websiteName = 'VAM2S Solarshine'
const engineers = ['Michael', 'Vishal', 'Alex', 'Steven', 'Maria']
const loggedIn = true


const Header = () => {

  return (
    <>    

  <nav class="navbar navbar-light bg-light">
    <a class="navbar-brand" href="#">
      <img src="/docs/images/teamLogo.png" width="60" height="30" alt=""></img>
      {websiteName}</a>
  </nav>

  <div>
    { loggedIn ? <h2 className='text-center mt-5'>Hello, Member</h2> : '' }  
  </div> 

  </>

  )
}

export default Header