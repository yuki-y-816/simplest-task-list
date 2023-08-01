import type { NextApiRequest, NextApiResponse } from "next"
import { ApiGateway } from "@/consts/app"
import { withSessionApi } from "@/libs/withSession"
import type { Item } from "@/features/todo/types"

type PostParam = {
    method: "create"
    todoItem: Item
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
        res.status(405).json({ message: "Method Not Allowed" })
        return
    }

    const reqBody = JSON.parse(req.body)

    const postParam: PostParam = {
        method: "create",
        todoItem: {
            userId: req.session.user?.id,
            task: reqBody.task,
        },
    }

    try {
        const response = await fetch(`${ApiGateway}/todo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postParam),
        }).then((res) => res.json())

        res.status(200).json(response)
    } catch (error) {
        console.log("error-->", error)
    }
}

export default withSessionApi(handler)
