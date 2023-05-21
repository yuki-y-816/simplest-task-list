import { test, expect, Page } from "@playwright/test"
import { login } from "@/tests/utils/utils"

test.describe("未ログイン", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/profile")
    })

    test("/profile にいる", async ({ page }) => {
        await expect(page).toHaveURL("/profile")
    })

    test("ログアウトボタンが表示されている", async ({ page }) => {
        await testLogoutBtnIsVisible(page)
    })

    test("データが取得できなかった旨のテキストが表示される", async ({ page }) => {
        const p = page.getByTestId("txt-no-user")

        await expect(p).toHaveText(/Sorry/i)
    })
})

test.describe("ログイン中", () => {
    test.beforeEach(async ({ page }) => {
        await login(page)
        await page.getByRole("link", { name: "Profile" }).click()
    })

    test("/profile にいる", async ({ page }) => {
        await expect(page).toHaveURL("/profile")
    })

    test("ログアウトボタンが表示されている", async ({ page }) => {
        await testLogoutBtnIsVisible(page)
    })

    test("プロフィールが正しく表示されている", async ({ page }) => {
        // 名前
        await expect(page.getByText("Name")).toBeVisible()
        await expect(page.getByText("Yuki")).toBeVisible()
        // メールアドレス
        await expect(page.getByText("Email")).toBeVisible()
        await expect(page.getByText("test@test.com")).toBeVisible()
    })
})

const testLogoutBtnIsVisible = async (page: Page) => {
    const btn = page.getByRole("button", { name: "Logout" })

    await expect(btn).toBeVisible()
}
