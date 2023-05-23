import Head from "next/head"
import { useState } from "react"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { ApiURL } from "@/consts/app"
import type { FormFillable } from "@/features/auth/types"
import { EmailForm, NameForm, PasswordForm } from "@/features/auth/components/inputForm"
import { useRouter } from "next/router"

const Signup = (): JSX.Element => {
    const [isCreating, setIsCreating] = useState(false)
    const form: UseFormReturn<FormFillable> = useForm<FormFillable>()
    const { handleSubmit, setError } = form
    const router = useRouter()
    const submitFunc: SubmitHandler<FormFillable> = async (data: FormFillable) => {
        setIsCreating(true)

        // サインイン API にパラメータ渡す
        const fetched = await fetch(`${ApiURL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then(async(res) => {
            return {
                status: res.status,
                body: await res.json()
            }
        })

        setIsCreating(false)

        if (fetched.status === 409) {
            // メールアドレスの重複
            setError(
                "email",
                { message: "This email address is already in use." },
                { shouldFocus: true }
            )
        }

        if (fetched.body.succeed === true) {
            // ユーザー作成に成功した場合はページ遷移
            router.push("/todo")
        }
    }


    return (
        <>
            <Head>
                <title>SignUp</title>
            </Head>
            <main>
                <div>
                    <p>Create Your Account!</p>
                    <div>
                        <form onSubmit={handleSubmit(submitFunc)}>
                            {NameForm(form)}
                            {EmailForm(form)}
                            {PasswordForm(form)}
                            <button type="submit" disabled={isCreating}>
                                {isCreating ? "Creating..." : "Sign up"}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Signup
