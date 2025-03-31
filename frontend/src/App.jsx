import { useState } from 'react'
import {Routes, Route} from 'react-router'
import './App.css'
import Home from './components/Home'
import Create from './components/Create'
import Edit from './components/Edit'

function App() {
  return (
    <>
      <Routes>
        <Route path="" element={<Home/>}/>
        <Route path="/create" element={<Create/>}/>
        <Route path="/edit/:id" element={<Edit/>}/>
      </Routes>
    </>
  )
}

export default App
