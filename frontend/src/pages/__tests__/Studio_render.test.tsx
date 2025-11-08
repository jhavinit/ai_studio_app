import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Studio from "../Studio";

// ✅ Mock hooks
jest.mock("@/contexts/AuthContext", () => ({
    useAuth: () => ({
        user: { email: "test@example.com" },
        logout: jest.fn(),
        isLoading: false,
    }),
}));

jest.mock("@/hooks/use-toast", () => ({
    useToast: () => ({ toast: jest.fn() }),
}));

jest.mock("@/hooks/useGenerate", () => ({
    useGenerate: () => ({
        generate: jest.fn(),
        abort: jest.fn(),
        isLoading: false,
    }),
}));

jest.mock("@/hooks/useRetry", () => ({
    useRetry: () => ({
        executeWithRetry: jest.fn(),
        isRetrying: false,
    }),
}));

// ✅ Mock child components
jest.mock("@/components/ImageUpload", () => () => (
    <div data-testid="image-upload">Mock Image Upload</div>
));
jest.mock("@/components/GenerationHistory", () => () => (
    <div data-testid="generation-history">Mock History</div>
));
jest.mock("@/components/AbortConfirmationDialog", () => () => (
    <div data-testid="abort-dialog">Mock Abort Dialog</div>
));

describe("🧠 Studio Page — Rendering", () => {
    it("renders upload, prompt, and style components", () => {
        render(
            <MemoryRouter>
                <Studio />
            </MemoryRouter>
        );

        // 🧩 Main section labels
        expect(screen.getByText("Create Generation")).toBeInTheDocument();
        expect(screen.getByText("History")).toBeInTheDocument();

        // 🧩 Mock components appear
        expect(screen.getByTestId("image-upload")).toBeInTheDocument();
        expect(screen.getByTestId("generation-history")).toBeInTheDocument();

        // 🧩 Input fields (Prompt + Style)
        expect(screen.getByLabelText("Prompt")).toBeInTheDocument();
        expect(screen.getByLabelText("Style")).toBeInTheDocument();
    });
});
