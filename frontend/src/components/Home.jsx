import React from 'react'
import BlogPost from './BlogPosts';

const Home = ({blogPosts}) =>{
    
    return(
      <>
      <div 
        style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',   // Horizontal centering
            justifyContent: 'center', // Vertical centering
            background: '#f5f5f5', // Optional: subtle background
            padding: '2rem'
      }}>
        {blogPosts.map((post) => (
          <BlogPost 
            key={post.id} 
            post={post}
          />
        ))}
      </div>
      </>
    )
}

export default Home