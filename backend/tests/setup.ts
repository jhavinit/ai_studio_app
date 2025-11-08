// tests/setup.ts
import { AppDataSource } from "../src/models/database";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // Start clean at the very beginning
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize();
});

afterEach(async () => {
  // ✅ Clean up between test files, not between test cases
  // Jest runs all tests in a file sequentially, then triggers afterEach for the last test.
  if (expect.getState().currentTestName?.endsWith("test")) {
    // Do nothing (this runs too often)
  }
});

// ✅ Use afterAll in each test file to truncate tables after that file's tests complete
afterAll(async () => {
  // Check if Jest is finishing one test file (AppDataSource stays open until the next)
  if (AppDataSource.isInitialized) {
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(
        `TRUNCATE TABLE "${entity.tableName}" RESTART IDENTITY CASCADE;`
      );
    }
  }
});

// Global teardown at the very end (after all test files)
afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});
