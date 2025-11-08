import request from "supertest";
import path from "path";
import app from "../src/server";
import { simulateGeneration } from "../src/services/generationService";

jest.mock("../src/services/generationService");

const baseUrl = "/generations";

describe("Generations Routes", () => {
  let token: string;
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    password: "secret123",
  };

  beforeAll(async () => {
    // Signup user once per suite
    const res = await request(app)
      .post("/auth/signup")
      .send(testUser)
      .expect(201);
    token = res.body.token;
  });

  const testImagePath = path.join(
    __dirname,
    `../${process.env.UPLOADS_DIR || "uploads_test"}/test-image.png`
  );

  it("should create a generation successfully (201)", async () => {
    (simulateGeneration as jest.Mock).mockResolvedValueOnce({ success: true });

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .field("prompt", "Elegant summer outfit")
      .field("style", "artistic")
      .attach("image", testImagePath)
      .expect(201);

    expect(res.body.prompt).toBe("Elegant summer outfit");
    expect(res.body.style).toBe("artistic");
  });

  it("should handle model overload (503)", async () => {
    (simulateGeneration as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: "Model overloaded",
    });

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .field("prompt", "Heavy test case")
      .field("style", "modern")
      .attach("image", testImagePath)
      .expect(503);

    expect(res.body).toHaveProperty("message", "Model overloaded");
  });

  it("should get user generations successfully (200)", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  // 🆕 Unauthorized tests
  it("should return 401 when accessing without a token", async () => {
    const res = await request(app)
      .get(baseUrl)
      // no Authorization header
      .expect(401);

    expect(res.body).toHaveProperty(
      "message",
      "Unauthorized: No token provided"
    );
  });

  it("should return 401 when accessing with an invalid token", async () => {
    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", "Bearer invalid.token.value")
      .expect(401);

    expect(res.body).toHaveProperty("message", "Unauthorized: Invalid token");
  });
});
