import { sendVerificationEmail } from "@/helpers/send-verification-email";
import dbConnect from "@/lib/db-connect";
import { UserModel } from "@/model/user.model";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const reqBody = request.json()
        const { username, email, password } = await reqBody;
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Error registering user',
            },
            { status: 500 }
        );
    }
}
