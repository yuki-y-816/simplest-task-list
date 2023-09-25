import { rest } from "msw"
import type { TodoItems, Item } from "@/features/todo/types"
import type { User } from "@/features/user/types"

const apiURL = process.env.API_GATEWAY_URL
const testUser: User = {
    id: "8n3CeEjw",
    name: "Yuki",
    email: "test@test.com",
}
const item: Item = {
    id: 1,
    userId: testUser.id,
    task: "this is test task",
    updatedAt: "2023-07-7 07:07:07",
}
const testTodoItems: TodoItems = [item]

export const handlers = [
    rest.post(`${apiURL}/signup`, async (req, res, ctx) => {
        const posted = await req.json()

        if (posted.user.email === testUser.email) {
            // アドレス被りのパターン
            return res(
                ctx.json({
                    errorMessage: "Error 1062 (23000): Duplicate entry 'test@test.com' for key 'user.email'",
                    errorType: "MySQLError",
                })
            )
        }

        // 正しくユーザー作成されている場合
        return res(
            ctx.json({
                id: "tekitooo",
            })
        )
    }),

    rest.post(`${apiURL}/login`, async (req, res, ctx) => {
        const posted = await req.json()
        const user = posted.email === "no-item@user.com" ? { id: "noItemUser" } : testUser
        return res(
            ctx.json({
                authenticated: true,
                data: {
                    user: user,
                },
            })
        )
    }),

    rest.post(`${apiURL}/user`, async (req, res, ctx) => {
        const posted = await req.json()

        if (posted.method === "select") {
            return res(ctx.json(testUser))
        }

        if (posted.method === "update") {
            return res()
        }
    }),

    rest.post(`${apiURL}/todo`, async (req, res, ctx) => {
        const posted = await req.json()

        switch (posted.method) {
            case "select":
                // todoItemが無いユーザーとしてログインしている場合
                if (posted.todoItem.userId === "noItemUser") {
                    return res(ctx.json([]))
                }

                return res(ctx.json(testTodoItems))

            case "create":
                const item: Item = {
                    id: Math.floor(Math.random() * 10000),
                    userId: posted.todoItem.userId,
                    task: posted.todoItem.task,
                }

                return res(ctx.status(200), ctx.json(item))

            case "update":
                return res(ctx.status(200), ctx.json({}))

            case "delete":
                return res(ctx.status(200), ctx.json({ result: true }))

            default:
                break
        }
    }),
]
