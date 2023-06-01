import { test, expect } from "@playwright/test"
import { login } from "@/tests/utils/action"
import { AppName } from "@/consts/app"

test.describe("ログイン中", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
        await page.getByRole("link", { name: "SIMPLE TO DO", exact: true }).click()
    })

    test("/todo にリダイレクトされている", async ({ page }) => {
        await expect(page).toHaveURL("/todo")
    })
})

test.describe("未ログイン", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/")
    })

    test("/ にいる", async ({ page }) => {
        await expect(page).toHaveURL("/")
    })

    test("正しいタイトルを持つ", async ({ page }) => {
        await expect(page).toHaveTitle(AppName)
    })

    test("正しいページ内容である", async ({ page }) => {
        const text = page.getByText("Welcome to SimpleTodo.")

        await expect(text).toBeVisible()
    })
})
