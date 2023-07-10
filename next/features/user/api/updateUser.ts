import { ApiGateway } from "@/consts/app"
import { User } from "@/features/user/types"

export const updateUser = async (user: User)=> {
    const postData = JSON.stringify({
        method: "update",
        filter: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    })

    try {
        await fetch(`${ApiGateway}/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: postData,
        })
    } catch (error) {
        console.log(error)
    }
}
