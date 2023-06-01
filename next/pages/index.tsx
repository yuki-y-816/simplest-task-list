import Head from "next/head"
import { useRouter } from "next/router"
import { AppName } from "@/consts/app"
import { withSessionSsr } from "@/libs/withSession"
import { GetServerSidePropsContext } from "next"
import { useCheckLogin } from "@/features/auth/hooks/useCheckLogin"

type LinkProp = {
    text: string
    path: string
}

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx

    // ログイン中であれば /todo にリダイレクト
    if (useCheckLogin(req) === true) {
        return {
            redirect: {
                destination: "/todo",
                statusCode: 302,
            },
        }
    }

    return { props: {} }
})

const Index = (): JSX.Element => {
    const router = useRouter()
    const link = (prop: LinkProp): JSX.Element => {
        return (
            <span className="mx-1 cursor-pointer text-blue-400 hover:underline" onClick={() => router.push(prop.path)}>
                {prop.text}
            </span>
        )
    }

    return (
        <>
            <Head>
                <title>{AppName}</title>
            </Head>
            <main>
                <div>
                    <p>Welcome to SimpleTodo.</p>
                    <p>This website allows you to create a simple TODO list.</p>
                    <p>
                        Feel free to
                        {link({ text: "Log in", path: "/auth/login" })}
                        and create your own TODO list.
                        <br />
                        Don't have an account yet? You can create one
                        {link({ text: "here", path: "/auth/signup" })}.
                    </p>
                </div>
            </main>
        </>
    )
}

export default Index
