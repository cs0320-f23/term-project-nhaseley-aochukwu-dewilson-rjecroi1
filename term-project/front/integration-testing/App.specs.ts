import { test, expect } from "@playwright/test";

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

test("if intern exists in database, can log in with correct user and password", async ({
  page,
}) => {
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
  await expect(page.toBe("http://localhost:5173/listings"));
  // how can I be able to check the web address and make sure that login is successful?

  await page.close();
});


test("if renter tries to log in and isn't verified, error message", async ({
  page,
}) => {});

test("clicking 'start' button on home screen takes you to registration page", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("button", { name: "START" }).click();
  await page
    .getByRole("heading", { name: "This is the registration form!" })
    .click();
  expect(page.locator(".start"));
  expect(page.locator("registration-page")).toBe(
    "This is the registration form!"
  );
  expect(page.toBe("http://localhost:5173/register"));
  // same issue, want to check url
});

