import React, {useState, useEffect} from 'react';
import BlogPost from './BlogPosts';
import Masonry from '@mui/lab/Masonry';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router';
export default function Home() {

    const [blogPosts, setBlogPosts] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
      fetch("http://127.0.0.1:8000/api/blogposts/")
        .then(response => response.json())
        .then(data => setBlogPosts(data))
        .catch(error => console.error(error));
    }, []);

    const handleEdit = (post) => {
      navigate(`/edit/${post.id}`, { state: { post } });
    };

    return(
      <Box
        sx={{
          minHeight: '100vh',
          background: '#f5f5f5',
          px: { xs: 2, md: 8 },
          py: 4,
        }}
      >
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
          {blogPosts.map((post) => (
            <BlogPost key={post.id} post={post} onEdit={handleEdit}/>
          ))}
        </Masonry>
      </Box>
    )
}
