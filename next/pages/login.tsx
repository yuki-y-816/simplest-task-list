import Head from "next/head"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"

type FormData = {
    email: string
    password: string
}

const Login = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>()

    const submitFunc = async (data: FormData) => {
        setIsLoading(true)
        // ログインのAPI呼び出しや認証処理をここに書く
        const fetched = await fetch("api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json())

        setIsLoading(false)

        console.log("fetched", fetched)
        console.log("input", data)
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
