import { useState } from "react"
import { GetServerSidePropsContext } from "next"
import { LogoutButton } from "@/features/auth/components/logoutButton"
import { withSessionSsr } from "@/libs/withSession"
import { getUser } from "@/features/user/api/getUser"
import { updateUser } from "@/features/user/api/updateUser"
import { User } from "@/features/user/types"
import { PencilIcon } from "@/components/elements/icons"
import { NameForm } from "@/features/auth/components/inputForm"
import type { FormFillable } from "@/features/auth/types"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Modal } from "flowbite-react"
import Head from "next/head"

type SsrProps = {
    succeed: boolean
    user: User
}

type ProfileFieldProps = {
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

const ProfileField = ({ user }: ProfileFieldProps): JSX.Element => {
    const recordClass = "grid grid-cols-5 md:grid-cols-7 gap-4"
    const fieldNameClass = "grid-span-1 text-right font-bold"
    const fieldValClass = "col-start-2 col-end-[-1]"

    const renameForm = useForm<FormFillable>({
        defaultValues: { name: user.name },
    })
    const { handleSubmit } = renameForm
    const [openModal, setOpenModal] = useState<boolean>(false)
    const props = { openModal, setOpenModal }
    const renameFunc: SubmitHandler<FormFillable> = async (data) => {
        props.setOpenModal(false)

        // API に変更した名前をPOSTする
        updateUser({
            id: user.id,
            name: data.name,
            email: "",
        })

        // 表示を変更したものにきりかえる
        user.name = data.name
    }

    return (
        <>
            <div>
                <div className={recordClass}>
                    <p className={fieldNameClass}>Name</p>
                    <p className={fieldValClass}>
                        {user.name}
                        <PencilIcon
                            id="rename-pencil-icon"
                            onClick={() => props.setOpenModal(true)}
                            className="inline-block cursor-pointer mx-4 fill-gray-500"
                        />
                    </p>
                </div>
                <div className={recordClass}>
                    <p className={fieldNameClass}>Email</p>
                    <p className={fieldValClass}>{user.email}</p>
                </div>
            </div>
            <Modal dismissible show={props.openModal} onClose={() => props.setOpenModal(false)}>
                <Modal.Body>
                    <form onSubmit={handleSubmit(renameFunc)}>
                        {NameForm(renameForm)}
                        <button type="submit" className="border-2 border-black">
                            Rename
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

const NoDataField = (): JSX.Element => {
    return (
        <>
            <div>
                <p data-testid="txt-no-user">
                    Sorry, we may have failed to retrieve your user data.
                    <br />
                    Try logging out, logging back in, and then trying to access it again.
                </p>
            </div>
        </>
    )
}

export const Profile = (props: SsrProps): JSX.Element => {
    const user: User = props.user
    const MainContent = (): JSX.Element => {
        if (props.succeed === true) {
            return <ProfileField user={user} />
        } else {
            return <NoDataField />
        }
    }

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <main className="mx-auto w-4/5">
                <div className="my-8 md:w-1/2 md:mx-auto">
                    <div className="text-2xl font-bold">Profile</div>
                    <MainContent />
                    <div className="my-8 flex justify-center">
                        <LogoutButton />
                    </div>
                </div>
            </main>
        </>
    )
}
export default Profile
