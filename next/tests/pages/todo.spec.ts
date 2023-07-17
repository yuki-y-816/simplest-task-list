import { test, expect } from "@playwright/test"
import { login } from "@/tests/utils/action"

test("未ログインだと /login にリダイレクトされる", async ({ page }) => {
    await page.goto("/todo")

    await expect(page).toHaveURL("/auth/login")
})

test.describe("ログイン中", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
    })

    test("/todo にいる", async ({ page }) => {
        await expect(page).toHaveURL("/todo")
    })

    test("タイトルが'Todo'である", async ({ page }) => {
        await expect(page).toHaveTitle("Todo")
    })

    test("タスクが表示されている", async ({ page }) => {
        const task = await page.getByText("this is test task")

        await expect(task).toBeVisible()
    })
})
