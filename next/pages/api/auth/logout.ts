import type { NextApiRequest, NextApiResponse } from "next"
import { withSessionApi } from "@/libs/withSession"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    req.session.destroy()

    res.status(200).json({
        succeed: true,
    })
}

export default withSessionApi(handler)
