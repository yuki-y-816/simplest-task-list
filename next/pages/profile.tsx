import React from "react"
import { GetServerSidePropsContext } from "next"
import { LogoutButton } from "@/components/auth/logoutButton"
import { withSessionSsr } from "@/libs/withSession"
import { getUser } from "@/features/user/api/getUser"
import { User } from "@/features/user/types"

type SsrProps = {
    succeed: boolean
    user: User
}

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx
    const userId = req.session.user?.id
    const user = await getUser(userId)

    let succeed: boolean = false

    if (user.succeed === true && user.data.id !== "") {
        succeed = true
    }

    const props: SsrProps = {
        succeed: succeed,
        user: user.data,
    }

    return {
        props: props,
    }
})

const profileFiled = (user: User): JSX.Element => {
    return (
        <div>
            <div>
                <div>Name</div>
                <div>{user.name}</div>
            </div>
            <div>
                <div>Email</div>
                <div>{user.email}</div>
            </div>
        </div>
    )
}

const noDataField = (): JSX.Element => {
    return (
        <div>
            <p data-testid="txt-no-user">
                Sorry, we may have failed to retrieve your user data.
                <br />
                Try logging out, logging back in, and then trying to access it again.
            </p>
        </div>
    )
}

export const Profile = (props: SsrProps): JSX.Element => {
    const user: User = props.user
    const getElementContent = (): JSX.Element => {
        if (props.succeed === true) {
            return profileFiled(user)
        } else {
            return noDataField()
        }
    }

    return (
        <>
            <div>Profile</div>
            <div>{getElementContent()}</div>
            <div>{LogoutButton()}</div>
        </>
    )
}

export default Profile
