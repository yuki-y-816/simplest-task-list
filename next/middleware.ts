import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getIronSession } from "iron-session/edge"

// This function can be marked `async` if using `await` inside
export const middleware = async (req: NextRequest) => {
    const res = NextResponse.next()
    const session = await getIronSession(req, res, {
        // Options must be defined directly
        password: process.env.IRON_COOKIE_PASSWORD as string,
        cookieName: "iron-session/simple-to-do",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production",
        },
    })

    // Do not allow access while logged in
    if (session.user?.id !== undefined) {
        return NextResponse.redirect(new URL("/profile", req.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: "/auth/(.+)",
}
