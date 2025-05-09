import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogPostDelete from './BlogPostDelete';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// Mock blog post data
const mockPosts = [
  {
    id: 1,
    title: 'First Post',
    content: 'This is the first blog post content.',
    categories: [{ name: 'Tech' }, { name: 'News' }]
  },
  {
    id: 2,
    title: 'Second Post',
    content: 'Second post content is here.',
    categories: [{ name: 'Life' }]
  }
];

describe('BlogPostDelete', () => {
  beforeEach(() => {
    // Reset fetch mocks before each test
    globalThis.fetch = vi.fn((url) => {
      if (url.endsWith('/api/blogposts/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPosts)
        });
      }
      if (url.endsWith('/api/posts/delete/')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders blog posts after fetch', async () => {
    render(<BlogPostDelete />);
    expect(screen.getByText(/Blog Posts/i)).toBeInTheDocument();

    // Wait for posts to load
    expect(await screen.findByText(/First Post/)).toBeInTheDocument();
    expect(screen.getByText(/Second Post/)).toBeInTheDocument();
    expect(screen.getByText(/Tech/)).toBeInTheDocument();
    expect(screen.getByText(/Life/)).toBeInTheDocument();
  });

  it('allows selecting and unselecting posts', async () => {
    render(<BlogPostDelete />);
    await screen.findByText(/First Post/);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(2);

    // Select first post
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();

    // Unselect first post
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
  });

  it('enables delete button only when posts are selected', async () => {
    render(<BlogPostDelete />);
    await screen.findByText(/First Post/);

    const deleteBtn = screen.getByRole('button', { name: /Delete Selected/i });
    expect(deleteBtn).toBeDisabled();

    // Select a post
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(deleteBtn).toBeEnabled();
  });

  it('shows confirmation dialog and deletes posts', async () => {
    render(<BlogPostDelete />);
    await screen.findByText(/First Post/);

    // Select a post
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    const deleteBtn = screen.getByRole('button', { name: /Delete Selected/i });

    // Open dialog
    fireEvent.click(deleteBtn);
    expect(screen.getByText(/Confirm Deletion/i)).toBeInTheDocument();

    // Confirm deletion
    const confirmBtn = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(confirmBtn);

    // Wait for dialog to close and for fetch to be called
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/posts/delete/'),
        expect.objectContaining({
          method: 'DELETE',
          body: JSON.stringify({ ids: [1] })
        })
      );
    });
  });

  it('handles fetch errors gracefully', async () => {
    // Force fetch to fail
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
    render(<BlogPostDelete />);
    expect(await screen.findByText(/Network error/)).toBeInTheDocument();
  });

  it('shows error if deletion fails', async () => {
    // First fetch is OK, deletion fails
    globalThis.fetch = vi.fn((url) => {
      if (url.endsWith('/api/blogposts/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPosts)
        });
      }
      if (url.endsWith('/api/posts/delete/')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ message: 'Deletion failed' })
        });
      }
      return Promise.reject(new Error('Unknown endpoint'));
    });

    render(<BlogPostDelete />);
    await screen.findByText(/First Post/);

    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    fireEvent.click(screen.getByRole('button', { name: /Delete Selected/i }));
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    expect(await screen.findByText(/Deletion failed/)).toBeInTheDocument();
  });
});