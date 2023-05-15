import { test, expect, Page } from "@playwright/test"

const getInputEmail = (page: Page) => {
    return page.locator("input#email")
}

const getInputPassword = (page: Page) => {
    return page.locator("input#password")
}

const getLoginBtn = (page: Page) =>{
    return page.getByRole("button", { name: "Login" })
}

test.beforeEach(async ({ page }) => {
    await page.goto("/login")
})

test("タイトルが'Login'である", async ({ page }) => {
    await expect(page).toHaveTitle("Login")
})

test.describe("Email inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const inputForm = getInputEmail(page)
        const loginBtn = getLoginBtn(page)
        const errContainer = page.getByTestId("error-email")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await loginBtn.click()

        await expect(errContainer).toHaveText(regex)
    })
})

test.describe("Password inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const inputForm = getInputPassword(page)
        const loginBtn = getLoginBtn(page)
        const errContainer = page.getByTestId("error-password")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await loginBtn.click()

        await expect(errContainer).toHaveText(regex)
    })

    test("5文字未満だとエラーメッセージが表示される", async ({ page }) => {
        const inputForm = getInputPassword(page)
        const loginBtn = getLoginBtn(page)
        const errContainer = page.getByTestId("error-password")
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
            const inputEmail = getInputEmail(page)
            const inputPassword = getInputPassword(page)
            const loginBtn = getLoginBtn(page)

            await inputEmail.fill("test@test.com")
            await inputPassword.fill("password")
            await loginBtn.click()

            await expect(page).toHaveURL("http://localhost:3030/todo")
        })
    })
})
