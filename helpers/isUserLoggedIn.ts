import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const isUserLoggedIn = async () => {
    const session = await getServerSession(authOptions)
    const user = session?.user

    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    return user
}
