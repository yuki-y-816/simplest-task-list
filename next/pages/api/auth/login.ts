import type { NextApiRequest, NextApiResponse } from "next"
import { ApiGateway } from "@/consts/app"
import { withSessionApi } from "@/libs/withSession"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method Not Allowed" })
        return
    }

    const postData = JSON.stringify({
        email: req.body.email,
        password: req.body.password,
    })

    try {
        const response = await fetch(`${ApiGateway}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: postData,
        }).then((res) => res.json())

        if (response.authenticated === true) {
            // 認証 OK
            // session にユーザーIDを記録
            req.session.user = {
                id: response.data.user.id,
            }
            await req.session.save()

            res.status(200).json({
                succeed: true,
                message: "Authentication successful",
            })
        } else {
            // 認証 NG
            // session 破棄
            req.session.destroy()

            res.status(401).json({
                succeed: false,
                message: "Authentication failed",
            })
        }
    } catch (error) {
        // session 破棄
        req.session.destroy()

        res.status(500).json({
            succeed: false,
            message: "Internal server error",
        })
    }
}

export default withSessionApi(handler)
