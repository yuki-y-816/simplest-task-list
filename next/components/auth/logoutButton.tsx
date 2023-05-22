//import React from "react"
import { useRouter } from "next/router"

export const LogoutButton = (): JSX.Element => {
    const router = useRouter()

    const handleButton = async () => {
        const result = await fetch("api/auth/logout").then((res) => res.json())

        if (result.succeed === true) {
            router.replace("/auth/login")
        }
    }

    return (
        <>
            <button onClick={handleButton} className="border-2 border-black">
                Logout
            </button>
        </>
    )
}

export default LogoutButton
