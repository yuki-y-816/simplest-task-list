import type { NextApiRequest, NextApiResponse } from "next"
import { withSessionApi } from "@/libs/withSession"
import checkLogin from "@/features/auth/functions/checkLogin"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const isLogin = checkLogin(req)

    res.status(200).json({
        isLogin: isLogin,
    })
}

export default withSessionApi(handler)
