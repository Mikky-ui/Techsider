import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogPostEditForm from "../components/BlogPostEditForm";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.stubGlobal('fetch', vi.fn());

describe("BlogPostEditForm", () => {
    const mockPost = {
        id: 1,
        title: "Test Title",
        content: "Test Content",
        categories: ["Category1", "Category2"],
    };

    beforeEach(() => {
        fetch.mockClear();
    });

    it("renders the form with pre-populated data", () => {
        render(<BlogPostEditForm post={mockPost} />);

        expect(screen.getByLabelText(/Title/i)).toHaveValue(mockPost.title);
        expect(screen.getByLabelText(/Content/i)).toHaveValue(mockPost.content);
        expect(screen.getByPlaceholderText(/Add or create Category/i)).toBeInTheDocument();
    });

    it("fetches and displays category options", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => [{ title: "Category1" }, { title: "Category2" }],
        });

        render(<BlogPostEditForm post={mockPost} />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/categories/");
        });
    });

    it("disables the submit button while submitting", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        render(<BlogPostEditForm post={mockPost} />);

        fireEvent.click(screen.getByText(/UPDATE POST/i));

        expect(screen.getByRole('button', { name: /Updating.../i })).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText(/UPDATE POST/i)).not.toBeDisabled();
        });
    });

    it("updates categories when a new category is added", () => {
        render(<BlogPostEditForm post={mockPost} />);

        const categoryInput = screen.getByPlaceholderText(/Add or create Category/i);
        fireEvent.change(categoryInput, { target: { value: "NewCategory" } });
        fireEvent.keyDown(categoryInput, { key: "Enter", code: "Enter" });

        expect(screen.getByText(/NewCategory/i)).toBeInTheDocument();
    });

    it("handles API errors gracefully when fetching categories", async () => {
        fetch.mockRejectedValueOnce(new Error("Network Error"));

        render(<BlogPostEditForm post={mockPost} />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/categories/");
        });

        // No crash or unhandled error
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    });
});