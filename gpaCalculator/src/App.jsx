import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import Gpa from './pages/gpa';
import Grade from './pages/Grade';
import Home from './pages/Home';
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/gpa' element={<Gpa />} />
          <Route path='/grade' element={<Grade />} />
        </Routes>
      </Router>
    </>
  );
}

export default App
