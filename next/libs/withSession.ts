// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next"

export const sessionOptions: IronSessionOptions = {
    password: process.env.IRON_COOKIE_PASSWORD as string,
    cookieName: "iron-session/simple-to-do",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
    },
}

export const withSessionApi = (handler: NextApiHandler) => {
    return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
    return withIronSessionSsr(handler, sessionOptions)
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
    interface IronSessionData {
        user?: {
            id: string
        }
    }
}
