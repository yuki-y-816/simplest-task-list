import { useState } from "react"

export const Dog = () : JSX.Element => {
    const [image, setImage] = useState("")
    const handleButton = async () => {
        const data = await fetch("https://dog.ceo/api/breeds/image/random")
            .then(res => res.json())

        setImage(data.message)
    }

    const imgElement = () => {
        if (image === "") {
            return
        }

        return <img src={image} alt="dog" className="max-w-xs max-h-80" />
    }

    return (
        <div className="flex flex-col gap-0.5 w-fit">
            <div>
                {imgElement()}
            </div>
            <button onClick={handleButton} className="border-2 border-black w-fit">
                Click
            </button>
        </div>
    )
}

export default Dog
