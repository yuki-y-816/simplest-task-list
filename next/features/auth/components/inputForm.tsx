import { UseFormReturn } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { FormFillable } from "@/features/auth/types"
import { RenderingErrorMessage } from "@/components/elements/errors"
import { TextInput } from "flowbite-react"

type Props = { form: UseFormReturn<FormFillable> }

export const NameForm = ({ form }: Props): JSX.Element => {
    const {
        register,
        formState: { errors },
    } = form
    return (
        <>
            <label htmlFor="name">Name</label>
            <TextInput
                type="text"
                id="name"
                autoComplete="off"
                {...register("name", {
                    required: "Please fill in Name.",
                    maxLength: {
                        value: 20,
                        message: "Name must be 20 characters or less.",
                    },
                })}
            />
            <div data-testid="error-name">
                <ErrorMessage name="name" errors={errors} render={({ message }) => RenderingErrorMessage(message)} />
            </div>
        </>
    )
}

export const EmailForm = ({ form }: Props): JSX.Element => {
    const {
        register,
        formState: { errors },
    } = form

    return (
        <>
            <label htmlFor="email">Email</label>
            <TextInput
                type="email"
                id="email"
                autoComplete="off"
                {...register("email", {
                    required: "Please fill in Email.",
                })}
            />
            <div data-testid="error-email">
                <ErrorMessage name="email" errors={errors} render={({ message }) => RenderingErrorMessage(message)} />
            </div>
        </>
    )
}

export const PasswordForm = ({ form }: Props): JSX.Element => {
    const {
        register,
        formState: { errors },
    } = form

    return (
        <>
            <label htmlFor="password">Password</label>
            <TextInput
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
            <div data-testid="error-password">
                <ErrorMessage
                    name="password"
                    errors={errors}
                    render={({ message }) => RenderingErrorMessage(message)}
                />
            </div>
        </>
    )
}
