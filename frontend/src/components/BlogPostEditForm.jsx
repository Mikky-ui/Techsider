import React, { useState, useEffect } from "react";
import { TextField, Stack, Button, Card, CardContent, Box, Typography, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

export default function BlogPostEditForm({ post }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  // Pre-populate form with post data
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      // Convert categories to string array if they come as objects
      setCategories(post.categories);
    }
  }, [post]);

  // Fetch existing categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories/');
        const data = await response.json();
        // Adjust based on your actual API response structure
        setCategoryOptions(data.categories?.map(c => c.title) || data.map(c => c.title));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:8000/api/posts/${post.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          categories
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post');
      }

      const data = await response.json();
      console.log('Success:', data);
      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "200%",
          maxWidth: 1000,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            EDIT BLOG POST
          </Typography>
          
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              Error: {error}
            </Typography>
          )}
          
          {success && (
            <Typography color="success.main" align="center" sx={{ mb: 2 }}>
              Post updated successfully!
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ width: "100%" }}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                multiline
                minRows={6}
                required
                fullWidth
              />

              <Autocomplete
                multiple
                freeSolo
                options={categoryOptions}
                value={categories}
                onChange={(event, newValue) => setCategories(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Categories"
                    placeholder="Add or create Category"
                    fullWidth
                  />
                )}
              />

              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting && <CircularProgress size={20} />}
              >
                {isSubmitting ? 'Updating...' : 'UPDATE POST'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
