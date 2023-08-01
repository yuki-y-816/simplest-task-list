export type TodoItems = Array<Item>

export type Item = {
    id?: number
    userId?: string
    task?: string
    createdAt?: string
    updatedAt?: string
}

export type TodoFormFillable = {
    task: string
}
