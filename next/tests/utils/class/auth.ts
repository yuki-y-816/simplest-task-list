import type { Page, Locator } from "@playwright/test"

export class AuthInputUtil {
    page: Page

    constructor(page: Page) {
        this.page = page
    }
    getNameField = (): Locator => {
        return this.page.locator("input#name")
    }

    getEmailField = (): Locator => {
        return this.page.locator("input#email")
    }

    getPasswordField = (): Locator => {
        return this.page.locator("input#password")
    }

    getErrContainer = (id: string): Locator => {
        return this.page.getByTestId(id)
    }

    getSignupBtn = (): Locator => {
        return this.page.getByRole("button", { name: "Sign up" })
    }

    getLoginBtn = (): Locator => {
        return this.page.getByRole("button", { name: "Login" })
    }
}
