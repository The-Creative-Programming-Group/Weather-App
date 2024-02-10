import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import en from "@weatherio/web/src/locales/en";

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
  await expect(page.locator('li[data-type="success"]')).toBeVisible({
    timeout: 6000,
  });
});

test("invalid email", async ({ page }) => {
  await goToContactAndFillForm(page, true, true, false, true);

  await page.fill("#email", "john.doe");

  await page.click("button[type=submit]");

  // Check the error element
  await expect(page.getByText(en["contact.invalid email"])).toBeVisible();
});
