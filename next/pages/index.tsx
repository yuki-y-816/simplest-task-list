import Head from "next/head"
import { useRouter } from "next/router"
import { AppName } from "@/consts/app"
import { withSessionSsr } from "@/libs/withSession"
import { GetServerSidePropsContext } from "next"
import checkLogin from "@/features/auth/functions/checkLogin"

type LinkProp = {
    text: string
    path: string
}

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx

    // ログイン中であれば /todo にリダイレクト
    if (checkLogin(req) === true) {
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
    const Link = (prop: LinkProp): JSX.Element => {
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
            <main className="mx-auto w-4/5 xl:text-center">
                <div className="my-8">
                    <p className="text-lg font-semibold">Welcome to SimpleTodo.</p>
                    <p>This website allows you to create a simple TODO list.</p>
                    <p>
                        Feel free to
                        <Link text="log in" path="/auth/login" />
                        and create your own TODO list.
                        <br />
                        Don&apos;t have an account yet? You can create one
                        <Link text="here" path="/auth/signup" />.
                    </p>
                </div>
            </main>
        </>
    )
}

export default Index
