import { rest } from "msw"
import { ApiGateway } from "@/consts/app"
import { TodoItems } from "@/features/todo/types"

const apiURL = ApiGateway
const testUser = {
    id: "8n3CeEjw",
    name: "Yuki",
    email: "test@test.com",
}
const testTodoItems = [
    {
        userId: testUser.id,
        task: "this is test task",
        updatedAt: "2023-07-7 07:07:07",
    },
]

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

    rest.post(`${apiURL}/login`, (req, res, ctx) => {
        return res(
            ctx.json({
                authenticated: true,
                data: {
                    user: testUser,
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

        if (posted.method === "select") {
            return res(ctx.json(testTodoItems))
        }
    }),
]
