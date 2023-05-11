import React from "react"
import { GetServerSidePropsContext } from "next"
import { LogoutButton } from "@/components/auth/logoutButton"
import { withSessionSsr } from "@/libs/withSession"
import { ApiURL } from "@/consts/app"

type User = {
    id: string
    name: string
    email: string
}

type SsrProps = {
    succeed: boolean
    user: User
}

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx
    const postData = {
        id: req.session.user?.id,
    }

    const fetched = await fetch(`${ApiURL}/user/info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
    }).then((res) => res.json())

    let succeed: boolean = false

    if (fetched.succeed === true && fetched.data.id !== "") {
        succeed = true
    }

    const props: SsrProps = {
        succeed: succeed,
        user: fetched.data,
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
            <p>
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
