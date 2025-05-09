import React, { useState, useEffect } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  Box,
  Typography
} from '@mui/material';

const BlogPostDelete = () => {
  // Sample blog posts data
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogposts/");
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleToggle = (id) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteConfirmed = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/posts/delete/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selected })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Deletion failed');
      }

      // Refresh posts after successful deletion
      const updatedPosts = await fetch("http://127.0.0.1:8000/api/blogposts/")
        .then(res => res.json());
      
      setBlogPosts(updatedPosts);
      setSelected([]);
    } catch (err) {
      setError(err.message);
      console.error("Delete error:", err);
    } finally {
      setLoading(false);
      setOpenConfirm(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Blog Posts
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        color="error"
        disabled={selected.length === 0 || loading}
        onClick={() => setOpenConfirm(true)}
        sx={{ mb: 2 }}
      >
        {loading ? 'Processing...' : `Delete Selected (${selected.length})`}
      </Button>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {blogPosts.map((post) => (
          <ListItem
            key={post.id}
            secondaryAction={
              <Checkbox
                edge="end"
                onChange={() => handleToggle(post.id)}
                checked={selected.includes(post.id)}
                disabled={loading}
              />
            }
            disablePadding
          >
            <ListItemButton>
              <ListItemText
                primary={post.title}
                secondary={
                  <>
                    <Typography variant="body2" color="text.primary">
                      {post.content.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {post.categories.map((category, index) => (
                        <Chip
                          key={index}
                          label={category.name || category}
                          size="small"
                          sx={{ mr: 0.5 }}
                        />
                      ))}
                    </Box>
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Dialog
        open={openConfirm}
        onClose={() => !loading && setOpenConfirm(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {selected.length} post(s)?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setOpenConfirm(false)} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirmed} 
            color="error" 
            autoFocus
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlogPostDelete;