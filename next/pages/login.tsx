import Head from "next/head"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { withSessionSsr } from "@/libs/withSession"
import { GetServerSidePropsContext } from "next"
import { useCheckLogin } from "@/hooks/useCheckLogin"

type FormData = {
    email: string
    password: string
}

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
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    const submitFunc = async (data: FormData) => {
        setIsLoading(true)

        // ログイン API にパラメータ渡す
        const fetched = await fetch("api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json())

        setIsLoading(false)

        console.log("fetched", fetched)
    }

    const renderErrMessage = (message: string): JSX.Element => {
        return <p className="text-red-400">{message}</p>
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
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    autoComplete="off"
                                    {...register("email", {
                                        required: "Please fill in Email.",
                                    })}
                                />
                                <ErrorMessage
                                    name="email"
                                    errors={errors}
                                    render={({ message }) => renderErrMessage(message)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    {...register("password", {
                                        required: "Please fill in Password.",
                                        minLength: {
                                            value: 5,
                                            message: "Password must be at least 5 characters.",
                                        },
                                    })}
                                />
                                <ErrorMessage
                                    name="password"
                                    errors={errors}
                                    render={({ message }) => renderErrMessage(message)}
                                />
                            </div>
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
