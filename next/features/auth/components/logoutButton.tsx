import { useRouter } from "next/router"
import { Button } from "flowbite-react"

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
            <Button onClick={handleButton} className="px-4">
                Logout
            </Button>
        </>
    )
}
export default LogoutButton
