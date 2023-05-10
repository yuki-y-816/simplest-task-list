import { GetServerSideProps } from "next"
import Head from "next/head"
import { ApiURL } from "@/consts/app"
import { Dog } from "@/components/elements/myTest/dog"
import { Hello } from "@/components/elements/myTest/hello"
import Link from "next/link"

type fetchData = {
    name: string | string[] | undefined
    age: string | string[] | undefined
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const props: fetchData = {
        name: context.query.name === undefined ? "yuki" : context.query.name,
        age: context.query.age === undefined ? "33" : context.query.age,
    }
    const res = await fetch(`${ApiURL}/hello`, {
        //const res = await fetch(`api/hello`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(props),
    })
    const fetchData: fetchData = await res.json()

    return {
        props: fetchData,
    }
}

const Test = (fetchData: fetchData): JSX.Element => {
    return (
        <>
            <Head>
                <title>Test</title>
            </Head>
            <main>
                <div className="text-red-400">this is test.</div>
                <div>
                    <p>name : {fetchData.name}</p>
                    <p>age : {fetchData.age}</p>
                </div>
                <div>{Dog()}</div>
                <div>{Hello()}</div>
                <div>
                    <Link href="/">Go to Index</Link>
                </div>
            </main>
        </>
    )
}

export default Test
