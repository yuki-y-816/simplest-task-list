import { ApiGateway } from "@/consts/app"
import { type User } from "@/features/user/types"
import type { TodoItems, Item } from "@/features/todo/types"

type postData = {
    method: "select"
    todoItem: Item
}

export const useGetItems = async (userId: User["id"]): Promise<TodoItems> => {
    let todoItems: TodoItems = []
    const postData: postData = {
        method: "select",
        todoItem: {
            userId: userId,
        },
    }

    try {
        const fetched = await fetch(`${ApiGateway}/todo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        }).then((res) => res.json())

        todoItems = fetched
    } catch (error) {
        console.log("error!! ->", error)
    }

    return todoItems
}

export default useGetItems
