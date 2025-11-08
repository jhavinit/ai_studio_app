// src/setupTests.ts
import "@testing-library/jest-dom";

// Silence React Router v7 future flag warnings during tests
const originalWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("React Router Future Flag Warning")
    ) {
      return;
    }
    originalWarn(...args);
  };
});

afterAll(() => {
  console.warn = originalWarn;
});
