import { test, expect } from "@playwright/test"
import { AuthInputUtil } from "@/tests/utils/class/auth"

test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signup")
})

test("タイトルが'SignUp'である", async ({ page }) => {
    await expect(page).toHaveTitle("SignUp")
})

test.describe("Name inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const inputForm = util.getNameField()
        const signupBtn = util.getSignupBtn()
        const errContainer = util.getErrContainer("error-name")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await signupBtn.click()

        await expect(errContainer).toHaveText(regex)
    })

    test("21文字以上だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const inputForm = util.getNameField()
        const signupBtn = util.getSignupBtn()
        const errContainer = util.getErrContainer("error-name")
        const regex = /20 characters or less/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("a".repeat(21))
        await signupBtn.click()
        await expect(errContainer).toHaveText(regex)

        await inputForm.clear()
        await inputForm.fill("a".repeat(20))
        await expect(errContainer).not.toHaveText(regex)
    })
})

test.describe("Email inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const inputForm = util.getEmailField()
        const signupBtn = util.getSignupBtn()
        const errContainer = util.getErrContainer("error-email")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await signupBtn.click()

        await expect(errContainer).toHaveText(regex)
    })

    test("メールアドレスに重複があるとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const nameField = util.getNameField()
        const emailField = util.getEmailField()
        const passField = util.getPasswordField()
        const signupBtn = util.getSignupBtn()
        const errContainer = util.getErrContainer("error-email")
        const regex = /already in use/

        await expect(errContainer).not.toHaveText(regex)

        await nameField.fill("somebody")
        await emailField.fill("test@test.com")
        await passField.fill("password")
        await signupBtn.click()

        await expect(errContainer).toHaveText(regex)
    })
})

test.describe("Password inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const inputForm = util.getPasswordField()
        const signupBtn = util.getSignupBtn()
        const errContainer = util.getErrContainer("error-password")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await signupBtn.click()

        await expect(errContainer).toHaveText(regex)
    })

    test("5文字未満だとエラーメッセージが表示される", async ({ page }) => {
        const util = new AuthInputUtil(page)
        const inputForm = util.getPasswordField()
        const signupBtn = util.getSignupBtn()
        const errContainer = util.getErrContainer("error-password")
        const regex = /at least 5 characters/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("a".repeat(4))
        await signupBtn.click()
        await expect(errContainer).toHaveText(regex)

        await inputForm.clear()
        await inputForm.fill("a".repeat(5))
        await expect(errContainer).not.toHaveText(regex)
    })
})

test.describe("全てのフォームに正しい入力がある場合", () => {
    test.beforeEach(async ({ page }) => {
        const util = new AuthInputUtil(page)
        const nameField = util.getNameField()
        const emailField = util.getEmailField()
        const passField = util.getPasswordField()
        const signupBtn = util.getSignupBtn()

        await nameField.fill("somebody")
        await emailField.fill("some@address.com")
        await passField.fill("password")
        await signupBtn.click()
    })

    test("/todo ページに遷移する", async ({ page }) => {
        await expect(page).toHaveURL("/todo")
    })
})
