import puppeteer, { Browser, Page } from "puppeteer";

describe("Home Page", () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: true });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("should display the correct title", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("title");

    const title = await page.title();
    expect(title).toBe("SATSQUARE App");
  });

  it("should have a join button", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("button");

    const buttonText = await page.$eval(
      "button",
      (button) => button.textContent
    );
    expect(buttonText).toBe("Rejoindre");
  });

  it("should have the logo header", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("div.mb-5");

    const logoHeaderExists = await page.$eval("div.mb-5", (div) => !!div);
    expect(logoHeaderExists).toBe(true);
  });

  it("should have a room ID input field", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("input[placeholder='Code de la salle']");

    const placeholderText = await page.$eval(
      "input[placeholder='Code de la salle']",
      (input) => input.getAttribute("placeholder")
    );
    expect(placeholderText).toBe("Code de la salle");
  });

  it("should be able to type in the room ID input field", async () => {
    await page.goto("http://localhost:3000");
    await page.waitForSelector("input[placeholder='Code de la salle']");

    const input = await page.$("input[placeholder='Code de la salle']");
    await input?.type("123456");

    const inputValue = await page.$eval(
      "input[placeholder='Code de la salle']",
      (input) => (input as HTMLInputElement).value
    );
    expect(inputValue).toBe("123456");
  });
});
