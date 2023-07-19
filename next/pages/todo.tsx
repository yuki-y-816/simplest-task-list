import Head from "next/head"
import { GetServerSidePropsContext } from "next"
import { withSessionSsr } from "@/libs/withSession"
import { useCheckLogin } from "@/features/auth/hooks/useCheckLogin"
import useGetItems from "@/features/todo/hooks/useGetItems"
import { TodoItems } from "@/features/todo/types"

type SsrProps = { items: TodoItems }
type TaskProps = { itemData: TodoItems }

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

const Tasks = (props: TaskProps): JSX.Element => {
    const data = props.itemData
    if (data.length === 0) {
        return <p>Tasks have not been added yet</p>
    }

    const items = data.map((item) => {
        return (
            <li key={item.id} className="border border-black rounded-md">
                <p className="mx-3 overflow-x-auto my-2">{item.task}</p>
            </li>
        )
    })

    return <ul className="my-3">{items}</ul>
}

const Todo = (props: SsrProps): JSX.Element => {
    return (
        <>
            <Head>
                <title>Todo</title>
            </Head>
            <main className="lg:w-3/5 mx-auto my-4 px-8">
                <div className="text-2xl font-bold">Todo</div>
                <Tasks itemData={props.items} />
            </main>
        </>
    )
}

export default Todo
