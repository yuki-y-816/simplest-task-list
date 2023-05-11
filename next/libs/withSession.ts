// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { GetServerSideProps, NextApiHandler } from "next"

const sessionOptions: IronSessionOptions = {
    password: process.env.IRON_COOKIE_PASSWORD as string,
    cookieName: "iron-session/simple-to-do",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
}

export const withSessionApi = (handler: NextApiHandler) => {
    return withIronSessionApiRoute(handler, sessionOptions)
}

export const withSessionSsr = (context: GetServerSideProps) => {
    return withIronSessionSsr(context, sessionOptions)
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: string
        }
    }
}
