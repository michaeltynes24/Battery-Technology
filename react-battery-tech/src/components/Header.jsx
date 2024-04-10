import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const websiteName = 'Shine'
const engineers = ['Michael', 'Vishal', 'Alex', 'Steven', 'Maria']
const loggedIn = true


const Header = () => {

  return (
    <>    

  <nav class="navbar navbar-light bg-light">
    <a class="navbar-brand ps-3" href="#">
      {websiteName}</a>
      <a class="nav-link active" aria-current="page" href="/">Sign Out</a>

  </nav>

  <div>
    { loggedIn ? <h2 className='text-center mt-5'>Hello, Member</h2> : '' }  
  </div> 

  </>

  )
}

export default Header