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
            const errText = util.getErrText("error-task")

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
})
