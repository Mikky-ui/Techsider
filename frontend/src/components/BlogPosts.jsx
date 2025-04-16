import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack
} from '@mui/material';

const BlogPost = ({ post }) => (
  <Card sx={{ maxWidth: 600, mb: 4, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="h5" gutterBottom>
        {post.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {post.content}
      </Typography>
      <Stack direction="row" spacing={1}>
        {post.categories.map((category, index) => (
          <Chip 
            key={index} 
            label={category} 
            color="primary" 
            variant="outlined" 
          />
        ))}
      </Stack>
    </CardContent>
  </Card>
);

export default BlogPost;
