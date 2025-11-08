import request from "supertest";
import app from "../src/server";

describe("Auth Routes", () => {
  const baseUrl = "/auth";

  const validUser = {
    email: `test_${Date.now()}@example.com`,
    password: "StrongPass123",
  };

  it("should signup successfully (201)", async () => {
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send(validUser)
      .expect(201);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({
      email: validUser.email,
    });
  });

  it("should fail signup with invalid email (400)", async () => {
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send({ email: "bademail", password: "123456" })
      .expect(400);

    expect(res.body).toHaveProperty("message", "Validation error");
    expect(res.body.errors[0]).toHaveProperty("field");
  });

  it("should fail signup if user already exists (400)", async () => {
    // first signup
    await request(app).post(`${baseUrl}/signup`).send(validUser);

    // second signup same user
    const res = await request(app)
      .post(`${baseUrl}/signup`)
      .send(validUser)
      .expect(400);

    expect(res.body).toHaveProperty("message", "User already exists");
  });

  it("should login successfully (200)", async () => {
    await request(app).post(`${baseUrl}/signup`).send(validUser);
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send(validUser)
      .expect(200);

    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", validUser.email);
  });

  it("should fail login with wrong password (401)", async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({ email: validUser.email, password: "wrongPass" })
      .expect(401);

    expect(res.body).toHaveProperty("message", "Invalid credentials");
  });

  it("should fail login with invalid email format (400)", async () => {
    const res = await request(app)
      .post(`${baseUrl}/login`)
      .send({ email: "not-an-email", password: "123" })
      .expect(400);

    expect(res.body.message).toBe("Validation error");
  });
});
