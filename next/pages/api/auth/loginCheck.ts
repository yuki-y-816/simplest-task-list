import type { NextApiRequest, NextApiResponse } from "next"
import { withSessionApi } from "@/libs/withSession"
import { useCheckLogin } from "@/features/auth/hooks/useCheckLogin"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const isLogin = useCheckLogin(req)

    res.status(200).json({
        isLogin: isLogin,
    })
}

export default withSessionApi(handler)
