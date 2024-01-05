import { expect, test } from "@playwright/test";

test("main workflow", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.click("a");

  await page.waitForURL("**/search");

  await page.fill("input[type=text]", "Munich");
  await page.waitForSelector("button[aria-label=Munich]");
  await page.press("input[type=text]", "Enter");

  await page.waitForURL("**/home");

  expect(page.url()).toBe("http://localhost:3000/home");
});

test("main workflow german city name", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await page.click("a");

  await page.waitForURL("**/search");

  await page.fill("input[type=text]", "München");
  await page.waitForSelector("button[aria-label=München]");
  await page.press("input[type=text]", "Enter");

  await page.waitForURL("**/home");

  expect(page.url()).toBe("http://localhost:3000/home");
});