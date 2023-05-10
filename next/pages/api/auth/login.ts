import type { NextApiRequest, NextApiResponse } from "next"
import { ApiGateway } from "@/consts/app"

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
            // Here you can handle successful authentication, e.g. setting a session or a JWT token
            res.status(200).json({ message: "Authentication successful" })
        } else {
            res.status(401).json({ message: "Authentication failed" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export default handler
