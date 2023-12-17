import { test, expect, chromium } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

test("if intern tries to register with non-Brown email, will see error message", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/register");
  await page.locator("#root").click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your name here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your name here")
    .fill("Angel Chukwuma");
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your Brown email here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your Brown email here")
    .fill("angel_chukwuma@gmail.com");
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your password here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your password here")
    .fill("abcd1234");
  await page.getByPlaceholder("Enter your Work Address here").click();
  await page
    .getByPlaceholder("Enter your Work Address here")
    .fill("47 Smith Street, Boston, MA");
  await page
    .getByLabel("You can registration as a student here")
    .getByRole("button", { name: "Register" })
    .click();
  await expect(page.locator(".student registration error")).toBe(
    "You must provide your Brown email address."
  );
  // extension says only 'You must provide your Brown'
});

test("trying register again", async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.waitForURL("http://localhost:5173/");
  await page.goto("http://localhost:5173/");
  await page.goto("http://localhost:5173/register");
  page.waitForURL("http://localhost:5173/register");
  await page.locator("#root").click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your name here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your name here")
    .fill("Angel Chukwuma");
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your Brown email here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your Brown email here")
    .fill("angel_chukwuma@gmail.com");
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your password here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your password here")
    .fill("abcd1234");
  await page.getByPlaceholder("Enter your Work Address here").click();
  await page
    .getByPlaceholder("Enter your Work Address here")
    .fill("47 Smith Street, Boston, MA");
  await page
    .getByLabel("You can registration as a student here")
    .getByRole("button", { name: "Register" })
    .click();
  expect(page.locator(".student registration error")).toBe(
    "You must provide your Brown email address."
  );

  await context.close();
  await browser.close();
});

test("if intern exists in database, can log in with correct user and password", async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:5173/login");
  await page.getByPlaceholder("Enter Brown email here").click();
  await page
    .getByPlaceholder("Enter Brown email here")
    .fill("nya_haseley-ayende@brown.edu");
  await page
    .getByLabel("You can login as a student")
    .getByPlaceholder("Enter password here")
    .click();
  await page
    .getByLabel("You can login as a student")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as a student")
    .getByRole("button", { name: "Login", exact: true })
    .click();
  await expect(page).toHaveURL("http://localhost:5173/listings");

  await context.close();
  await browser.close();
});

test("if renter tries to log in and isn't verified, error message", async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.getByRole("link", { name: "Register" }).click();
  await page
    .getByLabel("You can registration as a landlord here")
    .getByPlaceholder("Enter your name here")
    .click();
  await page
    .getByLabel("You can registration as a landlord here")
    .getByPlaceholder("Enter your name here")
    .fill("Angel Chukwuma");
  await page.getByPlaceholder("Enter your email here").click();
  await page
    .getByPlaceholder("Enter your email here")
    .fill("caramelapples360@gmail.com");
  await page
    .getByLabel("You can registration as a landlord here")
    .getByPlaceholder("Enter your password here")
    .click();
  await page
    .getByLabel("You can registration as a landlord here")
    .getByPlaceholder("Enter your password here")
    .fill("password");
  await page.getByPlaceholder("Enter your phone number here").click();
  await page
    .getByPlaceholder("Enter your phone number here")
    .fill("1112223333");
  await page
    .getByLabel("You can registration as a landlord here")
    .getByRole("button", { name: "Register" })
    .click();
  await page.getByRole("link", { name: "Login" }).click();
  await page
    .getByLabel("You can enter your email here (Must be a Google account)")
    .click();
  await page
    .getByLabel("You can enter your email here (Must be a Google account)")
    .fill("caramelapples360gmail.com");
  await page
    .getByLabel("You can login as a landlord here")
    .getByPlaceholder("Enter password here")
    .click();
  await page
    .getByLabel("You can login as a landlord here")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as a landlord here")
    .getByRole("button", { name: "Login", exact: true })
    .click();
  await page
    .getByRole("heading", {
      name: "This landlord does not exist in our database.",
    })
    .click();
  await expect(page).toHaveURL("http://localhost:5173/login");

  await context.close();
  await browser.close();
});

test("clicking 'start' button on home screen takes you to registration page", async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "START" }).click();
  await page
    .getByRole("heading", { name: "This is the registration form!" })
    .click();
  expect(page.locator(".start"));
  expect(page.locator("registration-page")).toBe(
    "This is the registration form!"
  );
  await expect(page).toHaveURL("http://localhost:5173/register");

  await context.close();
  await browser.close();
});

test("registering as an intern with non-brown email gives error", async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "START" }).click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your name here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your name here")
    .fill("Mary Mack");
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your Brown email here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your Brown email here")
    .fill("marymack@hotmail.com");
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your password here")
    .click();
  await page
    .getByLabel("You can registration as a student here")
    .getByPlaceholder("Enter your password here")
    .fill("password");
  await page.getByPlaceholder("Enter your work address here").click();
  await page
    .getByPlaceholder("Enter your work address here")
    .fill("69 Brown Street, Providence, RI 02912");
  await page
    .getByLabel("You can registration as a student here")
    .getByRole("button", { name: "Register" })
    .click();
  expect(page.getByText("You must provide")).toBe(
    "You must provide your Brown email address."
  );

  await context.close();
  await browser.close();
});

// copying for ease

test("", async () => {
  const browser = await chromium.launch({
    headless: false,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await context.close();
  await browser.close();
});
