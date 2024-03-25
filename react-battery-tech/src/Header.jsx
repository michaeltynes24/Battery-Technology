import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const webSiteName = 'VAM2S Solarshine'
const engineers = ['Michael', 'Vishal', 'Alex', 'Steven', 'Maria']
const loggedIn = true


const App = () => {
  return (
    <>    

  <nav class="navbar navbar-light bg-light">
    <a class="navbar-brand" href="#">
      <img src="/docs/images/teamLogo.png" width="60" height="30" alt=""></img>
      {webSiteName}</a>
  </nav>

  <div>
    { loggedIn ? <h2 className='text-center'>Hello, Member</h2> : ''}  
  </div>    
  </>
  )
}

export default App