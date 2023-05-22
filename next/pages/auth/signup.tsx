import Head from "next/head"
import { useState } from "react"
import type { SubmitHandler, UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { ApiURL } from "@/consts/app"
import type { FormFillable } from "@/features/auth/types"
import { EmailForm, NameForm, PasswordForm } from "@/features/auth/components/inputForm"

const Signup = (): JSX.Element => {
    const [isCreating, setIsCreating] = useState(false)
    const form: UseFormReturn<FormFillable> = useForm<FormFillable>()
    const { handleSubmit } = form
    const submitFunc: SubmitHandler<FormFillable> = async (data: FormFillable) => {
        setIsCreating(true)
        console.log("filled-->", data)

        // サインイン API にパラメータ渡す
        const fetched = await fetch(`${ApiURL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        }).then((res) => res.json())

        console.log("fetched-->", fetched)

        setIsCreating(false)
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
