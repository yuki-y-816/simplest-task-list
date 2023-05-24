import Head from "next/head"
import { useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import type { GetServerSidePropsContext } from "next"
import { withSessionSsr } from "@/libs/withSession"
import { useCheckLogin } from "@/hooks/useCheckLogin"
import { ApiURL } from "@/consts/app"
import type { FormFillable } from "@/features/auth/types"
import { EmailForm, PasswordForm } from "@/features/auth/components/inputForm"

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx

    if (useCheckLogin(req) === true) {
        // ログイン中であれば自分のプロフィールページへ
        return {
            redirect: {
                destination: "/profile",
                statusCode: 302,
            },
        }
    }

    return { props: {} }
})

const Login = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const form = useForm<FormFillable>()
    const { handleSubmit } = form

    const submitFunc = async (data: FormFillable) => {
        setIsLoading(true)

        // ログイン API にパラメータ渡す
        const fetched = await fetch(`${ApiURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json())

        setIsLoading(false)

        if (fetched.succeed === true) {
            router.push("/todo")
        }
    }

    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <main>
                <div>
                    <p>Login</p>
                    <div>
                        <form onSubmit={handleSubmit(submitFunc)}>
                            {EmailForm(form)}
                            {PasswordForm(form)}
                            <button type="submit" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Login"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Login
