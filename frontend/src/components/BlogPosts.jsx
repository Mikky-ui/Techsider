import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const BlogPost = ({ post, onEdit }) => (
  <Card sx={{ maxWidth: 600, mb: 4, boxShadow: 3 }}>
    <CardContent>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h5" gutterBottom>
          {post.title}
        </Typography>
        <IconButton 
          aria-label="edit" 
          onClick={() => onEdit(post)}
          color="primary"
        >
          <EditIcon />
        </IconButton>
      </div>
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
