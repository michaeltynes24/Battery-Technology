import React from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import CardStack from './components/CardStack';
import Footer from './components/Footer';


const App = () => {
  return (
    <>    

    <Header />
    <CardStack />
    <Footer />

    </>

  )
}

export default App