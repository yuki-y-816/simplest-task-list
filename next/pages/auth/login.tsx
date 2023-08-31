import Head from "next/head"
import { useState } from "react"
import { useRouter } from "next/router"
import { useForm, type SubmitHandler } from "react-hook-form"
import type { GetServerSidePropsContext } from "next"
import { withSessionSsr } from "@/libs/withSession"
import { useCheckLogin } from "@/features/auth/hooks/useCheckLogin"
import type { FormFillable } from "@/features/auth/types"
import { EmailForm, PasswordForm } from "@/features/auth/components/inputForm"
import { Button } from "flowbite-react"

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

    const submitFunc: SubmitHandler<FormFillable> = async (data) => {
        setIsLoading(true)

        // ログイン API にパラメータ渡す
        const fetched = await fetch("/api/auth/login", {
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
            <main className="mx-auto w-4/5">
                <div className="my-8 md:w-1/2 md:mx-auto">
                    <p className="text-2xl font-bold">Login</p>
                    <div className="py-4">
                        <form onSubmit={handleSubmit(submitFunc)}>
                            <EmailForm form={form} />
                            <PasswordForm form={form} />
                            <div className="py-4 flex justify-center">
                                <Button type="submit" disabled={isLoading} className="px-4">
                                    {isLoading ? "Loading..." : "Login"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}
export default Login
