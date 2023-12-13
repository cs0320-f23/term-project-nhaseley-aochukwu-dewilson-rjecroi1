import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5174/");
});

test("if intern tries to register with non-Brown email, will see error message", async ({
  page,
}) => {
  await page.goto("http://localhost:5174/register");
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
