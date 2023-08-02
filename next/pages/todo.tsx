import Head from "next/head"
import { useState } from "react"
import { GetServerSidePropsContext } from "next"
import { withSessionSsr } from "@/libs/withSession"
import { useCheckLogin } from "@/features/auth/hooks/useCheckLogin"
import useGetItems from "@/features/todo/hooks/useGetItems"
import { Item, TodoItems, TodoFormFillable } from "@/features/todo/types"
import { TextInput } from "flowbite-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { ErrorMessage } from "@hookform/error-message"
import { RenderingErrorMessage } from "@/components/elements/errors"
import { PlusIcon } from "@/components/elements/icons"

type SsrProps = { items: TodoItems }
type TaskProps = { itemData: TodoItems }
type CreateTaskFieldProps = { addTask: (item: Item) => void }

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx

    // 未ログインであればログインページにリダイレクト
    if (useCheckLogin(req) === false) {
        return {
            redirect: {
                destination: "/auth/login",
                statusCode: 302,
            },
        }
    }

    const items = await useGetItems(req.session.user?.id)

    return { props: { items: items } }
})

// タスク追加フォーム
const CreateTaskField = ({ addTask }: CreateTaskFieldProps): JSX.Element => {
    const {
        register,
        handleSubmit,
        resetField,
        clearErrors,
        formState: { errors },
    } = useForm<TodoFormFillable>()

    const submitFunc: SubmitHandler<TodoFormFillable> = async (input) => {
        const added = await fetch("/api/todo/create", {
            method: "POST",
            body: JSON.stringify(input),
        }).then((res) => res.json())
        console.log("added->", added)

        addTask(added)
        resetField("task")
    }

    return (
        <form onSubmit={handleSubmit(submitFunc)}>
            <TextInput
                id="task"
                icon={PlusIcon}
                type="text"
                placeholder="add a task"
                autoComplete="off"
                {...register("task", {
                    required: "At least one letter is required",
                    onBlur: () => clearErrors(["task"]),
                })}
            />
            <div data-testid="error-task">
                <ErrorMessage name="task" errors={errors} render={({ message }) => RenderingErrorMessage(message)} />
            </div>
        </form>
    )
}

// 各タスク表示
const Tasks = (props: TaskProps): JSX.Element => {
    const itemData = props.itemData
    if (itemData.length === 0) {
        return <p>Tasks have not been added yet</p>
    }

    const items = itemData.map((item) => {
        return (
            <li key={item.id} className="border border-black rounded-md my-2">
                <p className="mx-3 overflow-x-auto my-2">{item.task}</p>
            </li>
        )
    })

    return <ul className="my-3">{items}</ul>
}

const Todo = (props: SsrProps): JSX.Element => {
    const [todoItems, setTodoItems] = useState<TodoItems>(props.items)
    const addTask = (added: Item): void => {
        setTodoItems([...todoItems, added])
    }

    return (
        <>
            <Head>
                <title>Todo</title>
            </Head>
            <main className="lg:w-3/5 mx-auto my-4 px-8">
                <div className="text-2xl font-bold">Todo</div>
                <CreateTaskField addTask={addTask} />
                <Tasks itemData={todoItems} />
            </main>
        </>
    )
}

export default Todo
