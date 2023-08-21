import { UseFormReturn } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { TextInput } from "flowbite-react"
import { RenderingErrorMessage } from "@/components/elements/errors"
import type { TodoFormFillable } from "@/features/todo/types"
import { PencilIcon, PlusIcon } from "@/components/elements/icons"
import type { Icon } from "@/components/elements/icons/type"
import { useEffect, useState } from "react"

type Props = {
    form: UseFormReturn<TodoFormFillable>
    method: "create" | "update"
    defaultValue: string
}

const InputTask = ({ form, method, defaultValue }: Props): JSX.Element => {
    const {
        register,
        formState: { errors, isSubmitSuccessful },
        clearErrors,
    } = form
    let id: string = ""
    let icon: Icon = () => <></>
    let placeholder: string = ""
    let errorId: string = ""
    const [value, setValue] = useState<string>(defaultValue)

    // update で一つのコンポーネントを使い回す際の value を出し分ける
    useEffect(() => {
        setValue(defaultValue)
        clearErrors("task")
    }, [defaultValue, isSubmitSuccessful])

    switch (method) {
        case "create":
            id = "task"
            icon = PlusIcon
            placeholder = "add a task"
            errorId = "err-create-task"
            break

        case "update":
            id = `update-task`
            icon = PencilIcon
            placeholder = "update the task"
            errorId = "err-update-task"
            break
    }

    return (
        <>
            <TextInput
                id={id}
                icon={icon}
                type="text"
                placeholder={placeholder}
                value={value}
                autoComplete="off"
                {...register("task", {
                    required: "At least one letter is required",
                    onChange: (e) => setValue(e.target.value),
                })}
            />
            <div data-testid={errorId}>
                <ErrorMessage name="task" errors={errors} render={({ message }) => RenderingErrorMessage(message)} />
            </div>
        </>
    )
}
export default InputTask
