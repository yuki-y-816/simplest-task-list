import { NextApiRequest, NextApiResponse } from "next"
import { ApiGateway } from "@/consts/app"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method != "POST") {
        res.status(405).json({
            succeed: false,
            data: {},
            message: "Method Not Allowed",
        })

        return
    }

    if (req.body.id === undefined) {
        res.status(403).json({
            succeed: false,
            data: {},
            message: "No user id.",
        })

        return
    }

    const postData = JSON.stringify({
        method: "select",
        filter: {
            id: req.body.id,
        },
    })

    try {
        const userData = await fetch(`${ApiGateway}/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: postData,
        }).then((res) => res.json())

        res.status(200).json({
            succeed: true,
            data: userData,
        })
    } catch (error) {
        res.status(500).json({
            succeed: false,
            data: {},
            message: "Internal server error",
        })
    }
}

export default handler
