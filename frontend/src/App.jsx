import { useState, useEffect } from 'react'
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

  /*const blogPosts = [
    {
      id: 1,
      title: "Getting Started with React",
      content: "Learn the fundamentals of React component architecture...",
      categories: ["React", "Frontend"]
    },
    {
      id: 2,
      title: "Material UI Design Patterns",
      content: "Explore modern UI components with Material Design...",
      categories: ["Material UI", "Styling"]
    }
  ];*/

  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/blogposts/")
      .then(response => response.json())
      .then(data => setBlogPosts(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <>
      <Navbar
        content = {
          <Routes>
            <Route path="" element={<Home blogPosts={blogPosts} />}/>
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
