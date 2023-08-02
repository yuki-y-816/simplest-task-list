import type { Page, Locator } from "@playwright/test"

export class TodoInputUtil {
    page: Page

    constructor(page: Page) {
        this.page = page
    }

    getTaskField = (): Locator => {
        return this.page.locator("input#task")
    }

    getErrText = (id: string): Locator => {
        return this.page.getByTestId(id)
    }
}
