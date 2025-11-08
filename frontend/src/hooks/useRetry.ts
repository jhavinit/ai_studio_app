import { useState, useCallback } from "react";

interface UseRetryOptions<T> {
  maxRetries?: number;
  onSuccess?: (result: T) => void;
  onError?: (error: string) => void;
  onMaxRetriesReached?: () => void;
}

export const useRetry = <T>({
  maxRetries = 3,
  onSuccess,
  onError,
  onMaxRetriesReached,
}: UseRetryOptions<T> = {}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const executeWithRetry = useCallback(
    async (fn: () => Promise<T>): Promise<T | null> => {
      setIsRetrying(true);
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const result = await fn();
          setRetryCount(0);
          setIsRetrying(false);
          onSuccess?.(result);
          return result;
        } catch (error: any) {
          lastError = error;

          // Check if it's a "Model overloaded" error
          if (
            error.message?.includes("Model overloaded") &&
            attempt < maxRetries
          ) {
            setRetryCount(attempt + 1);
            onError?.(
              `Model overloaded. Retrying (${attempt + 1}/${maxRetries})...`
            );

            // Exponential backoff: 1s, 2s, 4s
            await new Promise((resolve) =>
              setTimeout(resolve, Math.pow(2, attempt) * 1000)
            );
          } else {
            // Don't retry for other errors
            break;
          }
        }
      }

      setIsRetrying(false);
      setRetryCount(0);

      if (lastError?.message?.includes("Model overloaded")) {
        onMaxRetriesReached?.();
        onError?.("Max retries reached. Please try again later.");
      } else {
        onError?.(lastError?.message || "An error occurred");
      }

      throw lastError;
    },
    [maxRetries, onSuccess, onError, onMaxRetriesReached]
  );

  const reset = useCallback(() => {
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    executeWithRetry,
    retryCount,
    isRetrying,
    reset,
  };
};
