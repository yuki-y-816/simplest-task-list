import { GetStaticProps } from "next"

export const getStaticProps: GetStaticProps = async () => {
    const res = await fetch(`${process.env.API_URL}/hello`)
    const fetchData = await res.json()

    return {
        props: fetchData
    }
}

type fetchData = {
    name: string,
    age: number
}

const Test = (fetchData: fetchData) => {
    return (
        <div>
            <div className="text-red-400">this is test.</div>
            <div>
                <p>{ fetchData.name }</p>
                <p>{ fetchData.age }</p>
            </div>
        </div>
    )
}

export default Test
