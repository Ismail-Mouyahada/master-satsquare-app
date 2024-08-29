import puppeteer, { Browser, Page } from "puppeteer";

describe("Home Page E2E Tests", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      slowMo: 50, // Slow down by 50ms per operation
    });
    page = await browser.newPage();
  }, 60000); // Increased timeout for setup

  afterAll(async () => {
    await browser.close();
  });

  it("should display the correct title", async () => {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    const title = await page.title();
    expect(title).toBe("Sat Square App");
  }, 30000);

  it("should navigate to the Rejoindre page", async () => {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    await page.click("a[href='/home']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    expect(page.url()).toBe("http://localhost:3000/home");
  }, 30000);

  it("should navigate to the Connexion lightning page", async () => {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    await page.click("a[href='/lightning']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    expect(page.url()).toBe("http://localhost:3000/lightning");
  }, 30000);

  it("should navigate to the Se connecter page", async () => {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    await page.click("a[href='/auth/signin']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    expect(page.url()).toBe("http://localhost:3000/auth/signin");
  }, 30000);

  it("should navigate to the S'inscrire page", async () => {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    await page.click("a[href='/auth/signup']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    expect(page.url()).toBe("http://localhost:3000/auth/signup");
  }, 30000);

  it("should navigate to the Manager de session page", async () => {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle2" });
    await page.click("a[href='/manager']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    expect(page.url()).toBe("http://localhost:3000/manager");
  }, 30000);
});
