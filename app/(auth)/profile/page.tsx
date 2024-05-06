import React from 'react'
import { auth } from "@/auth"

const ProfilePage = async () => {
    const session = await auth()

    return (
        <>
        <h1>Welcome {session?.user.username}!</h1>
        <p>You are logged in.</p>

        </>
    )
}

export default ProfilePage
