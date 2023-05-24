import { rest } from "msw"

const apiURL = "http://host.docker.internal:3000"
const testUser = {
    id: "8n3CeEjw",
    name: "Yuki",
    email: "test@test.com",
}

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
    }),
]
