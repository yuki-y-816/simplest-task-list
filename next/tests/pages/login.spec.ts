import { test, expect } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login")
})

test("タイトルが'Login'である", async ({ page }) => {
    await expect(page).toHaveTitle("Login")
})

test.describe("Email inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const inputForm = page.locator("input#email")
        const errContainer = page.getByTestId("error-email")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await page.getByRole("button", { name: "Login" }).click()

        await expect(errContainer).toHaveText(regex)
    })
})

test.describe("Password inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const inputForm = page.locator("input#password")
        const errContainer = page.getByTestId("error-password")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await page.getByRole("button", { name: "Login" }).click()

        await expect(errContainer).toHaveText(regex)
    })

    test("5文字未満だとエラーメッセージが表示される", async ({ page }) => {
        const inputForm = page.locator("input#password")
        const errContainer = page.getByTestId("error-password")
        const loginBtn = page.getByRole("button", { name: "Login" })
        const regex = /at least 5 characters/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("a".repeat(4))
        await loginBtn.click()
        await expect(errContainer).toHaveText(regex)

        await inputForm.clear()
        await inputForm.fill("a".repeat(5))
        await expect(errContainer).not.toHaveText(regex)
    })
})

test.describe("Loginボタン押下後の処理について", () => {
    test.describe("メールアドレスもパスワードも正しく入力されている", () => {
        test("/todo ページへ遷移する", async ({ page }) => {
            // API からのレスポンスをモック
            await page.route("http://host.docker.internal:3000/login", async (route) => {
                const json = {
                    authenticated: true,
                    data: {
                        user: {
                            id: "8n3CeEjw",
                            name: "Yuki",
                            email: "test@test.com",
                        },
                    },
                }

                await route.fulfill({ json })
            })

            await page.locator("input#email").fill("test@test.com")
            await page.locator("input#password").fill("password")
            await page.getByRole("button", { name: "Login" }).click()

            await expect(page).toHaveURL("http://localhost:3000/todo")
        })
    })
})
