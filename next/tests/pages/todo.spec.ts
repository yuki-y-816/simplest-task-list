import { test, expect } from "@playwright/test"
import { login } from "@/tests/utils/action"
import { TodoInputUtil } from "@/tests/utils/class/todo"

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

    test.describe("タスク追加フォーム関係", () => {
        test("タスク追加フォームがある", async ({ page }) => {
            const util = new TodoInputUtil(page)
            const form = util.getTaskField()

            await expect(form).toBeVisible()
        })

        test("未入力だとエラーメッセージが表示される", async ({ page }) => {
            const util = new TodoInputUtil(page)
            const form = util.getTaskField()
            const errText = util.getErrText("err-create-task")

            await expect(errText).not.toBeVisible()

            await form.type("")
            await form.press("Enter")

            await expect(errText).toBeVisible()
        })

        test("入力したタスクが一覧に追加される", async ({ page }) => {
            const util = new TodoInputUtil(page)
            const form = util.getTaskField()
            const task = "this is second string"

            await expect(page.getByText(task)).not.toBeVisible()

            await form.type(task)
            await form.press("Enter")

            await expect(page.getByText(task)).toBeVisible()
        })
    })

    test.describe("タスク削除関係", () => {
        test("タスクが非表示になる", async ({ page }) => {
            const deleteIcon = page.locator("#delete-item-1")
            const item = page.locator("#item-id-1")

            await expect(item).toBeVisible()

            await deleteIcon.click()

            await expect(item).not.toBeVisible()
        })
    })

    test.describe("タスク更新関係", () => {
        test("入力した内容でタスクの文字列が更新される", async ({ page }) => {
            const updateIcon = page.locator("#update-item-1")
            const item = page.locator("#item-id-1")

            await expect(item).toHaveText("this is test task")

            await updateIcon.click()

            const form = page.locator("#update-task")

            await form.clear()
            await form.type("updated string")
            await form.press("Enter")

            await expect(item).toHaveText("updated string")
        })

        test("更新後にフォームモーダルが閉じられる", async ({ page }) => {
            const updateIcon = page.locator("#update-item-1")

            await updateIcon.click()

            const form = page.locator("#update-task")

            await form.clear()
            await form.type("updated string")
            await form.press("Enter")

            await expect(form).not.toBeVisible()
        })
    })
})
