import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { server } from "@/tests/mocks/server"
import { Header } from "@/components/layouts/header"

if (process.env.MSW_MOCKING === "true") {
    server.listen({ onUnhandledRequest: "bypass" })
}

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            {Header()}
            <Component {...pageProps} />
        </>
    )
}
