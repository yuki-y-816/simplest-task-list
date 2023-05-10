import { useState } from "react"
import { Alert } from "flowbite-react"

export const Hello = (): JSX.Element => {
    const [inputName, setInputName] = useState("")
    const [greeting, setGreeting] = useState("")
    const [showAlert, setShowAlert] = useState(false)

    const fetching = async () => {
        const data = await fetch(`api/external/hello`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: inputName }),
        }).then((res) => res.json())

        setGreeting(data.greeting)
        setShowAlert(true)
    }

    const helloAlert = (): JSX.Element | undefined => {
        if (showAlert) {
            return (
                <Alert color="info" className="my-2" onDismiss={() => setShowAlert(false)}>
                    {greeting}
                </Alert>
            )
        }
    }

    return (
        <div>
            {helloAlert()}
            <div className="flex flex-col gap-1">
                <div>
                    <label htmlFor="name">Your Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={inputName}
                        placeholder="fill your name"
                        onChange={(e) => setInputName(e.target.value)}
                        className="text-right py-0.5 px-1"
                    />
                </div>
                <button onClick={fetching} className="border-2 border-black w-fit">
                    Say Hello
                </button>
            </div>
        </div>
    )
}

export default Hello
