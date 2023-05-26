export const useCheckLogin = (req: any): boolean => {
    const user = req.session.user
    let result = false

    if (user) {
        result = true
    }

    return result
}
