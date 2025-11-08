export const simulateGeneration = async (): Promise<{
  success: boolean;
  message?: string;
}> => {
  // Simulate processing delay (1-2 seconds)
  const delay = 1000 + Math.random() * 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  // 20% chance of "Model overloaded" error
  if (Math.random() < 0.2) {
    return { success: false, message: "Model overloaded" };
  }

  return { success: true };
};
