import { test, expect } from "@playwright/test"
import { AuthInputUtil } from "@/tests/utils/class/auth"

test.beforeEach(async ({ page }) => {
    await page.goto("/auth/login")
})

test("タイトルが'Login'である", async ({ page }) => {
    await expect(page).toHaveTitle("Login")
})

test.describe("Email inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const emailField = util.getEmailField()
        const loginBtn = util.getLoginBtn()
        const errContainer = util.getErrContainer("error-email")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await emailField.fill("")
        await loginBtn.click()

        await expect(errContainer).toHaveText(regex)
    })
})

test.describe("Password inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const emailField = util.getPasswordField()
        const loginBtn = util.getLoginBtn()
        const errContainer = util.getErrContainer("error-password")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await emailField.fill("")
        await loginBtn.click()

        await expect(errContainer).toHaveText(regex)
    })

    test("5文字未満だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const emailField = util.getPasswordField()
        const loginBtn = util.getLoginBtn()
        const errContainer = util.getErrContainer("error-password")
        const regex = /at least 5 characters/

        await expect(errContainer).not.toHaveText(regex)

        await emailField.fill("a".repeat(4))
        await loginBtn.click()
        await expect(errContainer).toHaveText(regex)

        await emailField.clear()
        await emailField.fill("a".repeat(5))
        await expect(errContainer).not.toHaveText(regex)
    })
})

test.describe("Loginボタン押下後の処理について", () => {
    test.describe("メールアドレスもパスワードも正しく入力されている", () => {
        test("/todo ページへ遷移する", async ({ page }) => {
            const util = new AuthInputUtil(page)
            const emailField = util.getEmailField()
            const passField = util.getPasswordField()
            const loginBtn = util.getLoginBtn()

            await emailField.fill("test@test.com")
            await passField.fill("password")
            await loginBtn.click()

            await expect(page).toHaveURL("/todo")
        })
    })
})
