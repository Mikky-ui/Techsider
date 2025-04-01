import { useState } from 'react'
import {Routes, Route} from 'react-router'
import './App.css'
import Home from './components/Home'
import Create from './components/Create'
import Edit from './components/Edit'
import Navbar from './components/navigation/navbar'

function App() {
  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Create', path: '/create' },
    { label: 'Edit', path: '/edit/:id' },
  ];

  return (
    <>
      <Navbar
        content = {
          <Routes>
            <Route path="" element={<Home/>}/>
            <Route path="/create" element={<Create/>}/>
            <Route path="/edit/:id" element={<Edit/>}/>
          </Routes>
        }
        navigationItems={navigationItems} // Pass navigation items here
      />
    </>
  )
}

export default App
