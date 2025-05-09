import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BlogPost from '../components/BlogPosts';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

describe('BlogPost Component', () => {
    const mockPost = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        categories: ['Tech', 'React'],
    };

    const mockOnEdit = vi.fn();

    it('renders the blog post title, content, and categories', () => {
        render(<BlogPost post={mockPost} onEdit={mockOnEdit} />);

        expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
        expect(screen.getByText('This is a test blog post content.')).toBeInTheDocument();
        expect(screen.getByText('Tech')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('renders the edit icon and triggers onEdit when clicked', () => {
        render(<BlogPost post={mockPost} onEdit={mockOnEdit} />);

        const editButton = screen.getByLabelText('edit');
        expect(editButton).toBeInTheDocument();

        fireEvent.click(editButton);
        expect(mockOnEdit).toHaveBeenCalledWith(mockPost);
    });
});