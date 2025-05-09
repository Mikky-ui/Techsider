import React, { useState, useEffect } from "react";
import { TextField, Stack, Button, Card, CardContent, Box, Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

export default function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('http://localhost:8000/api/categories/');
      const data = await response.json();
      setCategoryOptions(data.map(c => c.title));
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/api/create_post/', {
        method: 'POST',
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
        throw new Error(errorData.error || 'Failed to create post');
      }

      const data = await response.json();
      console.log('Success:', data);
      setSuccess(true);
      // Reset form on success
      setTitle("");
      setContent("");
      setCategories([]);
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
            CREATE BLOG POST
          </Typography>
          
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              Error: {error}
            </Typography>
          )}
          
          {success && (
            <Typography color="success.main" align="center" sx={{ mb: 2 }}>
              Post created successfully!
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
              >
                {isSubmitting ? 'Publishing...' : 'PUBLISH POST'}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
