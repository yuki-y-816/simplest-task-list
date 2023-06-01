import { Navbar } from "flowbite-react"
import { useEffect, useState } from "react"
import { ApiURL } from "@/consts/app"
import { useRouter } from "next/router"

export const Header = (): JSX.Element => {
    const [navLinks, setNavLinks] = useState<JSX.Element>()
    const router = useRouter()

    useEffect(() => {
        // ログイン中かどうかでヘッダーに表示する内容を出し分ける
        ;(async () => {
            const fetched = await fetch(`${ApiURL}/auth/loginCheck`).then(async (res) => {
                return {
                    status: res.status,
                    data: await res.json(),
                }
            })

            if (fetched.data.isLogin === true) {
                setNavLinks(
                    <>
                        <Navbar.Link href="/todo">Todo</Navbar.Link>
                        <Navbar.Link href="/profile">Profile</Navbar.Link>
                    </>
                )
            } else {
                setNavLinks(
                    <>
                        <Navbar.Link href="/auth/login">Login</Navbar.Link>
                        <Navbar.Link href="/auth/signup">Signup</Navbar.Link>
                    </>
                )
            }
        })()
    }, [router.pathname])

    return (
        <Navbar fluid={true} rounded={true}>
            <Navbar.Brand href="/">SIMPLE TO DO</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>{navLinks}</Navbar.Collapse>
        </Navbar>
    )
}

export default Header
