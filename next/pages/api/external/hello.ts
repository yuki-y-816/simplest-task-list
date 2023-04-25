import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    greeting: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const postData : string = JSON.stringify({
        name: req.body.name
    })

    const data = await fetch(`${process.env.HELLO_API_URL}/hello`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: postData
    })
        .then(res => res.json())

    res.status(200).json({
        greeting: data.Greeting
    })
}
