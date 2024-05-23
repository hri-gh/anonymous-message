import { z } from 'zod'

import dbConnect from "@/lib/db-connect";
import UserModel from "@/model/user.model";
import { UsernameValidation } from "@/schemas";



const UsernameQuerySchema = z.object({
    username: UsernameValidation,
});


export async function GET(request: Request) {
    await dbConnect();

    // localhost:3000/api/check-unique-username?username=sam&phone=123456789

    try {
        // Get the full url
        const { searchParams } = new URL(request.url);

        //console.log("SEARCH_PARAMS(request.url)::", searchParams);


        // Extract the 'username' query params
        const queryParams = {
            username: searchParams.get('username'),
        };


        // Validate with zod
        const result = UsernameQuerySchema.safeParse(queryParams)


        // console.log(result); // TODO: remove
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message:
                        usernameErrors?.length > 0
                            ? usernameErrors.join(', ')
                            : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }

        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Username is unique',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}
