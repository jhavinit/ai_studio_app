/// <reference types="cypress" />

describe("🧠 Full E2E Flow — Signup → Login → Upload → Generate → History → Restore", () => {
  const baseUrl = "http://localhost:8080";
  const user = {
    email: `user_${Date.now()}@example.com`,
    password: "Password123!",
  };

  it("Should complete full flow successfully", () => {
    // 🟢 1️⃣ SIGNUP
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit(`${baseUrl}/signup`);

    cy.get("form", { timeout: 10000 }).should("be.visible");
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get("#confirmPassword").type(user.password);
    cy.get('button[type="submit"]').click();

    cy.contains(/Account Created!|Welcome to AI Studio/i, {
      timeout: 20000,
    }).should("exist");
    cy.url({ timeout: 15000 }).should("include", "/studio");

    // ✅ Check token is saved
    cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(token).to.exist;
    });

    // 🟢 2️⃣ LOGOUT
    cy.contains("button", /Logout/i, { timeout: 10000 })
      .should("exist")
      .click();

    cy.url({ timeout: 20000 }).should("include", "/login");
    cy.get("form").should("be.visible");

    // 🟢 3️⃣ LOGIN again
    cy.get("#email").type(user.email);
    cy.get("#password").type(user.password);
    cy.get('button[type="submit"]').click();

    cy.contains(/Welcome back!|Successfully logged in/i, {
      timeout: 15000,
    }).should("exist");
    cy.url({ timeout: 15000 }).should("include", "/studio");

    // 🟢 4️⃣ UPLOAD image
    cy.log("Uploading sample image...");
    cy.get('input[type="file"]').selectFile("cypress/fixtures/sample.jpg", {
      force: true,
    });

    // Verify upload success or preview
    cy.get("img[alt='Selected']", { timeout: 10000 }).should("be.visible");

    // 🟢 5️⃣ ENTER prompt and style, click Generate
    cy.get("#prompt").type("A futuristic landscape with glowing trees");
    cy.get("#style").click();
    cy.contains("Artistic").click();
    cy.contains("button", /Generate/i).click();

    // Wait for generation complete message
    cy.contains(/Generating.../i, { timeout: 5000 }).should("exist");
    cy.contains(/Generation Complete/i, { timeout: 30000 }).should("exist");

    // Verify result section shows
    cy.contains("Final Result", { timeout: 20000 }).should("be.visible");

    // 🟢 6️⃣ VERIFY History updates
    cy.log("Checking history section...");
    cy.get("aside")
      .scrollIntoView()
      .within(() => {
        cy.contains("History").should("exist");
        cy.get("img").should("exist");
      });

    // 🟢 7️⃣ RESTORE an image from History
    cy.get("aside img").first().click();

    // Verify workspace updated with restored image
    cy.contains(/Loaded from history/i, { timeout: 10000 }).should("exist");
    cy.get("#prompt").should(
      "have.value",
      "A futuristic landscape with glowing trees"
    );
  });
});
