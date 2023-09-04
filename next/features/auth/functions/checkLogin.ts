const checkLogin = (req: any): boolean => {
    const user = req.session.user

    if (user) {
        return true
    }

    return false
}
export default checkLogin
