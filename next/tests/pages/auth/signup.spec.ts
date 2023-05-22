import { test, expect } from "@playwright/test"
import type { Page, Locator } from "@playwright/test"

class PageUtil {
    page: Page

    constructor(page: Page) {
        this.page = page
    }
    getInputName = (): Locator => {
        return this.page.locator("input#name")
    }
    getInputEmail = (): Locator => {
        return this.page.locator("input#email")
    }
    getInputPassword = (): Locator => {
        return this.page.locator("input#password")
    }
    getErrContainer = (id: string): Locator => {
        return this.page.getByTestId(id)
    }
    getSubmitBtn = (): Locator => {
        return this.page.getByRole("button", { name: "Sign up" })
    }
}

test.beforeEach(async ({ page }) => {
    await page.goto("/auth/signup")
})

test("タイトルが'SignUp'である", async ({ page }) => {
    await expect(page).toHaveTitle("SignUp")
})

test.describe("Name inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const pageUtil = new PageUtil(page)
        const inputForm = pageUtil.getInputName()
        const submitBtn = pageUtil.getSubmitBtn()
        const errContainer = pageUtil.getErrContainer("error-name")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await submitBtn.click()

        await expect(errContainer).toHaveText(regex)
    })

    test("21文字以上だとエラーメッセージが表示される", async ({ page }) => {
        const pageUtil = new PageUtil(page)
        const inputForm = pageUtil.getInputName()
        const submitBtn = pageUtil.getSubmitBtn()
        const errContainer = pageUtil.getErrContainer("error-name")
        const regex = /20 characters or less/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("a".repeat(21))
        await submitBtn.click()
        await expect(errContainer).toHaveText(regex)

        await inputForm.clear()
        await inputForm.fill("a".repeat(20))
        await expect(errContainer).not.toHaveText(regex)
    })
})

test.describe("Email inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const pageUtil = new PageUtil(page)
        const inputForm = pageUtil.getInputEmail()
        const submitBtn = pageUtil.getSubmitBtn()
        const errContainer = pageUtil.getErrContainer("error-email")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await submitBtn.click()

        await expect(errContainer).toHaveText(regex)
    })
})

test.describe("Password inputフォームの挙動について", () => {
    test("未入力だとエラーメッセージが表示される", async ({ page }) => {
        const pageUtil = new PageUtil(page)
        const inputForm = pageUtil.getInputPassword()
        const submitBtn = pageUtil.getSubmitBtn()
        const errContainer = pageUtil.getErrContainer("error-password")
        const regex = /fill in/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("")
        await submitBtn.click()

        await expect(errContainer).toHaveText(regex)
    })

    test("5文字未満だとエラーメッセージが表示される", async ({ page }) => {
        const pageUtil = new PageUtil(page)
        const inputForm = pageUtil.getInputPassword()
        const submitBtn = pageUtil.getSubmitBtn()
        const errContainer = pageUtil.getErrContainer("error-password")
        const regex = /at least 5 characters/

        await expect(errContainer).not.toHaveText(regex)

        await inputForm.fill("a".repeat(4))
        await submitBtn.click()
        await expect(errContainer).toHaveText(regex)

        await inputForm.clear()
        await inputForm.fill("a".repeat(5))
        await expect(errContainer).not.toHaveText(regex)
    })
})
