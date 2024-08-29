import puppeteer, { Browser, Page } from "puppeteer";

describe("Home Page with Auth", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();

    // Simulate login
    await page.goto("http://localhost:3000/auth/signin"); // Replace with your actual sign-in URL

    // Fill in email and password
    await page.type("input#email", "test@example.com"); // Replace with your test user email
    await page.type("input#password", "password"); // Replace with your test user password

    // Submit the form
    await page.click("button[type=submit]");

    // Wait for navigation to complete
    await page.waitForNavigation();
  }, 30000); // Increased timeout for login

  afterAll(async () => {
    await browser.close();
  });

  it("should display the correct title", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("title");

    const title = await page.title();
    expect(title).toBe("Sat Square App");
  }, 20000);

  it("should have a join button", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("button", { timeout: 20000 });

    const buttonText = await page.$eval(
      "button",
      (button) => button.textContent
    );
    expect(buttonText).toBe("Rejoindre");
  }, 20000);

  it("should have the logo header", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("img[alt='logo']", { timeout: 20000 });

    const logoHeaderExists = await page.$eval(
      "img[alt='logo']",
      (img) => !!img
    );
    expect(logoHeaderExists).toBe(true);
  }, 20000);

  it("should have a room ID input field", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("input[placeholder='Code de la salle']", {
      timeout: 20000,
    });

    const placeholderText = await page.$eval(
      "input[placeholder='Code de la salle']",
      (input) => input.getAttribute("placeholder")
    );
    expect(placeholderText).toBe("Code de la salle");
  }, 20000);

  it("should be able to type in the room ID input field", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("input[placeholder='Code de la salle']", {
      timeout: 20000,
    });

    const input = await page.$("input[placeholder='Code de la salle']");
    await input?.type("123456");

    const inputValue = await page.$eval(
      "input[placeholder='Code de la salle']",
      (input) => (input as HTMLInputElement).value
    );
    expect(inputValue).toBe("123456");
  }, 20000);
});
