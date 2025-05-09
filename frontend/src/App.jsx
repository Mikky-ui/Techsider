import {Routes, Route} from 'react-router'
import './App.css'
import Home from './components/Home'
import Create from './components/Create'
import Edit from './components/Edit'
import Navbar from './components/navigation/navbar'
import BlogPostDelete from './components/BlogPostDelete'

function App() {
  const navigationItems = [
    { label: 'Home', path: '/' },
    { label: 'Create', path: '/create' },
    { label: 'Edit', path: '/edit/:id' },
    { label: 'Delete', path:'/delete'}
  ];

  return (
    <>
      <Navbar
        content = {
          <Routes>
            <Route path="" element={<Home/>}/>
            <Route path="/create" element={<Create/>}/>
            <Route path="/edit/:id" element={<Edit/>}/>
            <Route path="/delete" element={<BlogPostDelete/>}/>
          </Routes>
        }
        navigationItems={navigationItems} // Pass navigation items here
      />
    </>
  )
}

export default App
