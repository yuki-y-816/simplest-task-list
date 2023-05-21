import { ApiGateway } from "@/consts/app"
import { User } from "@/features/user/types"

export const getUser = async (id: User["id"]) => {
    const user: User = {
        id: "",
        name: "",
        email: "",
    }

    // id が正しく引数に渡されていない場合
    if (id === undefined) {
        return {
            succeed: false,
            data: user,
        }
    }

    const postData = JSON.stringify({
        method: "select",
        filter: {
            id: id,
        },
    })

    let succeed: boolean
    try {
        const fetched = await fetch(`${ApiGateway}/user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: postData,
        }).then((res) => res.json())

        succeed = true
        user.id = fetched.id
        user.name = fetched.name
        user.email = fetched.email
    } catch (error) {
        succeed = false
    }

    return {
        succeed: succeed,
        data: user,
    }
}

export default getUser
