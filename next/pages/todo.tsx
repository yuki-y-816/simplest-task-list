import Head from "next/head"
import { useState } from "react"
import { GetServerSidePropsContext } from "next"
import { withSessionSsr } from "@/libs/withSession"
import checkLogin from "@/features/auth/functions/checkLogin"
import useGetItems from "@/features/todo/hooks/useGetItems"
import { Item, TodoItems, TodoFormFillable } from "@/features/todo/types"
import { Modal } from "flowbite-react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { PencilIcon, DeleteIcon } from "@/components/elements/icons"

import InputTask from "@/features/todo/components/inputTask"

type SsrProps = { items: TodoItems }
type TaskProps = { itemData: TodoItems }
type CreateTaskFieldProps = { addTask: (item: Item) => void }

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx

    // 未ログインであればログインページにリダイレクト
    if (checkLogin(req) === false) {
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
    const form = useForm<TodoFormFillable>()
    const { handleSubmit, resetField } = form

    const createFunc: SubmitHandler<TodoFormFillable> = async (input) => {
        const added = await fetch("/api/todo/create", {
            method: "POST",
            body: JSON.stringify(input),
        }).then((res) => res.json())

        addTask(added)
        resetField("task")
    }

    return (
        <form onSubmit={handleSubmit(createFunc)}>
            <InputTask form={form} method="create" defaultValue="" />
        </form>
    )
}

// タスク削除ボタン押下
const deleteFunc = async (itemId: Item["id"]) => {
    const fetched = await fetch(`/api/todo/delete/${itemId}`, {
        method: "DELETE",
    }).then((res) => res.json())

    if (fetched.result === true) {
        const element = document.querySelector(`#item-id-${itemId}`)

        element?.remove()
    }
}

// 特定のタスクの Element 要素を取得
const getTaskElement = (id: number): Element | null => {
    return document.querySelector(`#item-id-${id} > p`)
}

// 各タスク表示
const Tasks = (props: TaskProps): JSX.Element => {
    const itemData = props.itemData
    const form = useForm<TodoFormFillable>()
    const { handleSubmit } = form
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [inputItemId, setInputItemId] = useState<number>(0)
    const [inputValue, setInputValue] = useState<string>("")

    if (itemData === undefined || itemData.length === 0) {
        return <p>Tasks have not been added yet</p>
    }

    const updateFunc: SubmitHandler<TodoFormFillable> = async (input) => {
        const inputTask = input.task
        const fetched = await fetch(`/api/todo/update/${inputItemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task: inputTask }),
        }).then((res) => res)

        if (fetched.status !== 200) {
            return
        }

        const task = getTaskElement(inputItemId)

        if (task !== null) {
            task.textContent = inputTask
        }

        setOpenModal(false)
    }

    const items = itemData.map((item) => {
        const itemId = Number(item.id)
        const task = String(item.task)

        return (
            <li
                key={itemId}
                id={`item-id-${itemId}`}
                className="border border-black rounded-md my-2 flex items-center justify-between"
            >
                <p className="mx-3 overflow-x-auto my-2">{task}</p>
                <div className="flex items-center gap-3 mx-4">
                    <PencilIcon
                        id={`update-item-${itemId}`}
                        onClick={() => {
                            setOpenModal(true)
                            setInputItemId(itemId)

                            const element = getTaskElement(itemId)
                            if (element !== null) {
                                setInputValue(String(element.textContent))
                            }
                        }}
                        className="cursor-pointer"
                    />
                    <DeleteIcon
                        id={`delete-item-${itemId}`}
                        onClick={() => deleteFunc(itemId)}
                        className="w-5 h-5 cursor-pointer"
                    />
                </div>
            </li>
        )
    })

    return (
        <div>
            <ul className="my-3">{items}</ul>
            <Modal show={openModal} dismissible onClose={() => setOpenModal(false)}>
                <Modal.Body>
                    <form onSubmit={handleSubmit(updateFunc)}>
                        <InputTask form={form} method="update" defaultValue={inputValue} />
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    )
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
                <div className="my-2">
                    <CreateTaskField addTask={addTask} />
                </div>
                <Tasks itemData={todoItems} />
            </main>
        </>
    )
}
export default Todo
