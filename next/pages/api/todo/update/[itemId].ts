import type { NextApiRequest, NextApiResponse } from "next"
import { ApiGateway } from "@/consts/app"
import { withSessionApi } from "@/libs/withSession"
import type { Item } from "@/features/todo/types"

type PostParam = {
    method: "update"
    todoItem: Item
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "PUT") {
        res.status(405).json({ message: "Method Not Allowed" })
        return
    }

    const itemId = Number(req.query.itemId)
    const postParam: PostParam = {
        method: "update",
        todoItem: {
            userId: req.session.user?.id,
            id: itemId,
            task: req.body.task,
        },
    }

    try {
        const response = await fetch(`${ApiGateway}/todo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postParam),
        }).then((res) => res)

        return res.status(res.statusCode).end()
    } catch (error) {
        console.log("error-->", error)
    }
}
export default withSessionApi(handler)
