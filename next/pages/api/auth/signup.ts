import type { NextApiRequest, NextApiResponse } from "next"
import { ApiGateway } from "@/consts/app"
import { withSessionApi } from "@/libs/withSession"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method Not Allowed" })
        return
    }

    const input = req.body
    const postData = JSON.stringify({
        name: input.name,
        email: input.email,
        password: input.password,
    })

    try {
        const response = await fetch(`${ApiGateway}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: postData,
        }).then((res) => res.json())

        console.log("response-->", response)

        //
        // session にユーザーIDを記録
        //

        res.status(200).json({})
    } catch (error) {
        // session 破棄
        req.session.destroy()

        res.status(500).json({
            succeed: false,
        })
    }
}

export default withSessionApi(handler)
