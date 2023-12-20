import { test, expect, chromium } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173/");
});

test("clicking 'start' button on home screen takes you to registration page", async ({page}) => {
  await page.getByRole("button", { name: "START" }).click();
  await expect(page).toHaveURL("http://localhost:5173/register");
});

test("student registration with non-Brown email displays an error message", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/register");
  await page
    .getByLabel("You can register as a student here")
    .getByPlaceholder("Enter your name here")
    .fill("Angel Chukwuma");
  await page
    .getByLabel("You can register as a student here")
    .getByPlaceholder("Enter your Brown email here")
    .fill("angel_chukwuma@gmail.com");
  await page
    .getByLabel("You can register as a student here")
    .getByPlaceholder("Enter your password here")
    .fill("abcd1234");
  await page
    .getByPlaceholder("Enter your work address here")
    .fill("47 Smith Street, Boston, MA");
  await page
    .getByLabel("You can register as a student here")
    .getByLabel("You can submit registration here")
    .click();
  await page.waitForTimeout(500);

  const studentRegistrationErr = await page.locator(".student-registration-error").innerText()
  expect(studentRegistrationErr).toBe(
    "You must provide your Brown email address."
  );
});

test("if student exists in database, can log in with correct user and password", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/login");
  await page
    .getByLabel("You can login as a student here")
    .getByPlaceholder("Enter Brown email here")
    .fill("nya_haseley-ayende@brown.edu");
  await page
    .getByLabel("You can login as a student")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as a student")
    .getByRole("button", { name: "Login", exact: true })
    .click();
    // TODO: more complicated bc have to login with google also
  
  await expect(page).toHaveURL("http://localhost:5173/listings");
});

test("student denied login with incorrect password", async ({page}) => {
  await page.goto("http://localhost:5173/login");
  await page
    .getByLabel("You can login as a student here")
    .getByPlaceholder("Enter Brown email here")
    .fill("nya_haseley-ayende@brown.edu");
  await page
    .getByLabel("You can login as a student here")
    .getByPlaceholder("Enter password here")
    .fill("cheese");
  await page
    .getByLabel("You can login as a student here")
    .getByRole("button", { name: "Login", exact: true })
    .click();
  await page.waitForTimeout(500);

  const studentLoginErr = await page.locator(".student-login-error").innerText()
  expect(studentLoginErr).toBe("Invalid login credentials.");
  // denied login access so would not navigate to listings page
  await expect(page).toHaveURL("http://localhost:5173/login");
});

test("student can log in and then sign out", async ({page}) => {
  await page.goto("http://localhost:5173/login");
  await page
    .getByLabel("You can login as a student")
    .getByPlaceholder("Enter Brown email here")
    .fill("angel_chukwuma@brown.edu");
  await page
    .getByLabel("You can login as a student")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as a student")
    .getByRole("button", { name: "Login", exact: true })
    .click(); // TODO: more complicated bc have to login with google also
  await page.getByRole("link", { name: "Sign Out" }).click();
  // intern signs out, taken back to login page
  await expect(page).toHaveURL("http://localhost:5173/login");
});

test("student denied access to listings page without logging in first", async ({page}) => {  
  await page.goto("http://localhost:5173/listings");
  // logged out intern cannot view listings page
  const notLoggedIn = await page.locator(".not-logged-in").innerText();
  expect(notLoggedIn).toBe("Please log in.");
});

test("logged in student denied access to the landlord homepage", async ({page}) => {
  await page.goto("http://localhost:5173/login");
  await page
    .getByLabel("You can login as a student")
    .getByPlaceholder("Enter Brown email here")
    .fill("angel_chukwuma@brown.edu");
  await page
    .getByLabel("You can login as a student")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as a student")
    .getByRole("button", { name: "Login", exact: true })
    .click(); // TODO: more complicated bc have to login with google also
  await page.getByRole("link", { name: "My Listings" }).click();
  await page
    .getByRole("heading", { name: "Only landlords can have acess" })
    .click();
  expect(page.getByText("Only landlords can have")).toBe(
    "Only landlords can have acess to this page"
  );
});


test("admins can log in successfully with correct user and password", async ({page}) => {
  await page.goto("http://localhost:5173/login");
  await page
    .getByLabel("You can login as an admin here")
    .getByPlaceholder("Enter Brown email here")
    .fill("angel_chukwuma@brown.edu");
  await page
    .getByLabel("You can login as an admin here")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as an admin here")
    .getByRole("button", { name: "Login", exact: true })
    .click();
  await expect(page).toHaveURL("http://localhost:5173/admin");
  // TODO: more complicated bc have to login with google also
});

test("landlord who is verified can log in and see the 'my listings page'", async ({page}) => {

  await page.goto("http://localhost:5173/login");
  await page
    .getByLabel("You can enter your email here (Must be a Google account)")
    .fill("angel_chukwuma@brown.edu");
  await page
    .getByLabel("You can login as a landlord")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as a landlord")
    .getByRole("button", { name: "Login", exact: true })
    .click(); // TODO: more complicated bc have to login with google also
  await expect(page).toHaveURL("http://localhost:5173/LandLordsHomepage");
});

test("if landlord tries to log in and isn't verified, error message", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/login");
  await page
    .getByLabel("You can login as a landlord here")
    .getByLabel("You can enter your email here (Must be a Google account)")
    .fill("caramelapples360@gmail.com");
  await page
    .getByLabel("You can login as a landlord here")
    .getByPlaceholder("Enter password here")
    .fill("password");
  await page
    .getByLabel("You can login as a landlord here")
    .getByRole("button", { name: "Login", exact: true })
    .click();
  await page.waitForTimeout(1000);
  const landlordLoginErr = await page.locator(".landlord-login-error").innerText()
  expect(landlordLoginErr).toBe("This landlord is not yet verified in our database.")
  await expect(page).toHaveURL("http://localhost:5173/login");
});