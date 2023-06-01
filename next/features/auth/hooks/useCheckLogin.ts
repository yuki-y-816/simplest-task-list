export const useCheckLogin = (req: any): boolean => {
    const user = req.session.user

    if (user) {
        return true
    }

    return false
}
