import { test, expect } from "@playwright/test"

test("has Call a dog button", async ({ page }) => {
    await page.goto("http://localhost:3000/test")

    await expect(page).toHaveTitle("Test")
});
