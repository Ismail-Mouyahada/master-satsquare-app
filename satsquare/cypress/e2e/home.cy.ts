describe("Room Component Tests", () => {
  beforeEach(() => {
    // Visit the page containing the Room component before each test
    cy.visit("/home"); // Adjust the URL if the Room component is under a different route
  });

  it("should render the input field for room code", () => {
    // Check if the input field for the room code is rendered
    cy.get('input[placeholder="Code de la session"]').should("be.visible");
  });

  it("should render the 'Rejoindre' button", () => {
    // Check if the 'Rejoindre' button is rendered
    cy.contains("Rejoindre").should("be.visible");
  });

  it("should navigate back to home when 'Retour à l'accueil' is clicked", () => {
    // Click the "Retour à l'accueil" link and verify navigation
    cy.contains("Retour à l'accueil").click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
