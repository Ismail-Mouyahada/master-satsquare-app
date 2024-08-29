describe("Principal Page Tests", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("/");
  });

  it("should navigate to the Se connecter page when the button is clicked", () => {
    // Wait for the "Se connecter" button to be visible and click it
    cy.get('a[href="/auth/signin"]', { timeout: 10000 }).click();

    // Wait for navigation and check the URL using cy.location()
    cy.location("pathname", { timeout: 10000 }).should(
      "include",
      "/auth/signin"
    );
  });

  it("should navigate to the S'inscrire page when the button is clicked", () => {
    // Wait for the "S'inscrire" button to be visible and click it
    cy.get('a[href="/auth/signup"]', { timeout: 10000 }).click();

    // Wait for navigation and check the URL using cy.location()
    cy.location("pathname", { timeout: 10000 }).should(
      "include",
      "/auth/signup"
    );
  });
});
