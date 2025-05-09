import React from 'react'
import BlogPostEditForm from './BlogPostEditForm'
import { useLocation } from 'react-router';

const Edit = () => {
    const { state } = useLocation();
    
    // Get the post from navigation state
    const post = state?.post;

    return(
        <div>
            <BlogPostEditForm post={post} />
        </div>
    )
}

export default Edit