import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogPostForm from "../components/BlogPostForm";
import { describe, it, expect, beforeEach, vi } from "vitest";

vi.stubGlobal('fetch', vi.fn((url) => {
    if (url.includes("/categories")) {
        return Promise.resolve({
            ok: true,
            json: async () => [{ title: "Tech" }, { title: "Lifestyle" }],
        });
    }
    if (url.includes("/submit")) {
        return Promise.resolve({
            ok: true,
            json: async () => ({ message: "Post created successfully" }),
        });
    }
    return Promise.reject(new Error("Unknown endpoint"));
}));

describe("BlogPostForm", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it("renders the form with all fields", () => {
        render(<BlogPostForm />);

        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Categories/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /PUBLISH POST/i })).toBeInTheDocument();
    });

    it("submits the form successfully", async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ title: "Tech" }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Post created successfully" }),
            });

        render(<BlogPostForm />);

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test Title" } });
        fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: "Test Content" } });
        fireEvent.change(screen.getByLabelText(/Categories/i), { target: { value: "Tech" } });

        fireEvent.click(screen.getByRole("button", { name: /PUBLISH POST/i }));

        await waitFor(() => {
            expect(screen.getByText(/Post created successfully!/i)).toBeInTheDocument();
        });
    });

    it("displays an error message if form submission fails", async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ title: "Tech" }],
            })
            .mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: "Failed to create post" }),
            });

        render(<BlogPostForm />);

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test Title" } });
        fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: "Test Content" } });
        fireEvent.change(screen.getByLabelText(/Categories/i), { target: { value: "Tech" } });

        fireEvent.click(screen.getByRole("button", { name: /PUBLISH POST/i }));

        await waitFor(() => {
            expect(screen.getByText(/Error: Failed to create post/i)).toBeInTheDocument();
        });
    });

    it("disables the submit button while submitting", async () => {
        fetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => [{ title: "Tech" }],
            })
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ message: "Post created successfully" }),
            });

        render(<BlogPostForm />);

        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "Test Title" } });
        fireEvent.change(screen.getByLabelText(/Content/i), { target: { value: "Test Content" } });
        fireEvent.change(screen.getByLabelText(/Categories/i), { target: { value: "Tech" } });

        const submitButton = screen.getByRole("button", { name: /PUBLISH POST/i });
        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();

        await waitFor(() => {
            expect(screen.getByText(/Post created successfully!/i)).toBeInTheDocument();
        });
    });
});

