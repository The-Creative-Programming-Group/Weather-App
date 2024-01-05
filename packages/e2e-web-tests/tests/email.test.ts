import { expect, type Page, test } from "@playwright/test";
import contactTranslations from "../../../apps/web/public/locales/en/contact.json" assert { type: 'json' };

const goToContactAndFillForm = async (
  page: Page,
  fillFirstName: boolean,
  fillLastName: boolean,
  fillEmail: boolean,
  fillMessage: boolean,
) => {
  await page.goto("http://localhost:3000/contact");

  if (fillFirstName) {
    await page.fill("#firstname", "John");
  }
  if (fillLastName) {
    await page.fill("#lastname", "Doe");
  }
  if (fillEmail) {
    await page.fill("#email", "john.doe@example.com");
  }
  if (fillMessage) {
    await page.fill("#message", "Hello World! This is a playwright test.");
  }
};

test("contact form", async ({ page }) => {
  await goToContactAndFillForm(page, true, true, true, true);

  await page.click("button[type=submit]");

  // Check the toast
  expect(
    (await page.waitForSelector('li[data-type="success"]')).isVisible(),
  ).toBeTruthy();
});

test("invalid email", async ({ page }) => {
  await goToContactAndFillForm(page, true, true, false, true);

  await page.fill("#email", "john.doe");

  await page.click("button[type=submit]");

  // Check the error element
  await expect(
    page.getByText(contactTranslations["invalid email"]),
  ).toBeVisible();
});
