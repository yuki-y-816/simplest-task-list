import { Page } from "@playwright/test"

export const login = async (page: Page) => {
    await page.goto("/login")
    await page.locator("input#email").fill("test@test.com")
    await page.locator("input#password").fill("password")
    await page.getByRole("button", { name: "Login" }).click()
}
