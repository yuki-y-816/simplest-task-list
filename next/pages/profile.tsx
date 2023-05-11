import React from "react"
import { GetServerSidePropsContext } from "next"
import { LogoutButton } from "@/components/auth/logoutButton"
import { withSessionSsr } from "@/libs/withSession"

export const getServerSideProps = withSessionSsr(async function (ctx: GetServerSidePropsContext) {
    const { req } = ctx
    return { props: {} }
})

export const Profile = (): JSX.Element => {
    return (
        <>
            <div>Profile</div>
            <div>{LogoutButton()}</div>
        </>
    )
}

export default Profile
