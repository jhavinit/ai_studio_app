import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.test.json"
      }
    ]
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleDirectories: ["node_modules", "src"],
  transformIgnorePatterns: [
    "/node_modules/(?!(node-fetch|@react-hook/|@radix-ui|@hookform|react-hook-form|framer-motion|@floating-ui|react-markdown|rehype-raw|@tailwindcss|d3-array|d3-color|d3-format|d3-interpolate|d3-scale|d3-time|d3-time-format|internmap|react-markdown|rehype-raw|rehype-sanitize|rehype-slug|rehype-stringify|remark-gfm|remark-parse|remark-rehype|unified|unist-util-visit|vfile|vfile-message|@floating-ui|react-markdown|rehype-raw|rehype-sanitize|rehype-slug|rehype-stringify|remark-gfm|remark-parse|remark-rehype|unified|unist-util-visit|vfile|vfile-message)/)"
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};