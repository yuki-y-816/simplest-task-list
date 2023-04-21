import { useState } from "react";

export const Hello = (): JSX.Element => {
    const [inputName, setInputName] = useState("")
    const [greeting, setGreeting] = useState("")

    const fetching = async () => {
        //const data = await fetch("http://host.docker.internal:3000/hello", {
        const data = await fetch("http://localhost:3000/hello", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name: inputName})
        })
            .then(res => res.json())

        setGreeting(data.Greeting)
        console.log(document.querySelector("input[name=name]"))
    }

    return (
        <div>
            <div className="flex flex-col gap-1">
                <div>
                    <label htmlFor="name">Your Name:</label>
                    <input type="text" name="name" value={inputName}
                        placeholder="fill your name"
                        onChange={e => setInputName(e.target.value)}
                        className="text-right py-0.5 px-1"/>
                </div>
                <button onClick={fetching} className="border-2 border-black w-fit">
                    Say Hello
                </button>
            </div>
            <p className="text-xl font-semibold text-red-400">{greeting}</p>
        </div>
    )
}

export default Hello
