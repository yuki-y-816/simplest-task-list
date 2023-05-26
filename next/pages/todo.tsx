import Head from "next/head"
import React from "react"
import { withSessionSsr } from "@/libs/withSession"
import { useCheckLogin } from "@/features/auth/hooks/useCheckLogin"
import { GetServerSidePropsContext } from "next"

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

    return { props: {} }
})

const Todo = (): JSX.Element => {
    return (
        <>
            <Head>
                <title>Todo</title>
            </Head>
            <main>
                <p>Todo</p>
            </main>
        </>
    )
}

export default Todo
