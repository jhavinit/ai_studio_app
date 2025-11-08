import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  createdAt: string;
  status: "success" | "error";
}

interface UseGenerateOptions {
  onSuccess?: (generation: Generation) => void;
  onError?: (error: string) => void;
}

export const useGenerate = ({
  onSuccess,
  onError,
}: UseGenerateOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { token } = useAuth();

  const generate = async (image: File, prompt: string, style: string) => {
    setIsLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);
      formData.append("style", style);

      const response = await fetch("http://localhost:3001/generations", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Generation failed");
      }

      const data: Generation = await response.json();

      setIsLoading(false);
      onSuccess?.(data);
      return data;
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("Generation aborted");
        onError?.("Generation aborted");
      } else {
        const errorMessage = err.message || "Failed to generate";
        setError(errorMessage);
        onError?.(errorMessage);
      }
      setIsLoading(false);
      throw err;
    }
  };

  const abort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort({
        message: "Generation manually aborted",
      });
      setIsLoading(false);
    }
  };

  return { generate, abort, isLoading, error };
};
