describe("Home Page Tests", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("/");
  });

  it("should navigate to the Rejoindre page when the button is clicked", () => {
    // Wait for the "Rejoindre" button to be visible
    cy.get("button").contains("Rejoindre").click();

    // Verify that a new tab with the correct URL opens
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    cy.get("button").contains("Rejoindre").click();
    cy.get("@windowOpen").should("be.calledWith", "/home", "_blank");
  });

  it("should navigate to the Connexion lightning page when the button is clicked", () => {
    // Wait for the "Connexion lightning" button to be visible
    cy.get("button").contains("Connexion lightning").click();

    // Verify that a new tab with the correct URL opens
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    cy.get("button").contains("Connexion lightning").click();
    cy.get("@windowOpen").should("be.calledWith", "/lightning", "_blank");
  });

  it("should navigate to the Se connecter page when the button is clicked", () => {
    // Wait for the "Se connecter" button to be visible
    cy.get("button").contains("Se connecter").click();

    // Verify that the URL changes to '/auth/signin'
    cy.url().should("include", "/auth/signin");
  });

  it("should navigate to the S'inscrire page when the button is clicked", () => {
    // Wait for the "S'inscrire" button to be visible
    cy.get("button").contains("S'inscrire").click();

    // Verify that the URL changes to '/auth/signup'
    cy.url().should("include", "/auth/signup");
  });

  it("should navigate to the Manager de session page when the button is clicked", () => {
    // Wait for the "Manager de session" button to be visible
    cy.get("button").contains("Manager de session").click();

    // Verify that a new tab with the correct URL opens
    cy.window().then((win) => {
      cy.stub(win, "open").as("windowOpen");
    });
    cy.get("button").contains("Manager de session").click();
    cy.get("@windowOpen").should("be.calledWith", "/manager", "_blank");
  });
});
