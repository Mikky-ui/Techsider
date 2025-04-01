import { useState } from 'react'
import {Routes, Route} from 'react-router'
import './App.css'
import Home from './components/Home'
import Create from './components/Create'
import Edit from './components/Edit'
import Navbar from './components/navigation/navbar'

function App() {
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
      />
    </>
  )
}

export default App
