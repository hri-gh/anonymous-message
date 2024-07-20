import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

import dbConnect from "@/lib/db-connect";
import UserModel from "@/model/user.model";


export async function GET(request: Request) {
    // Connect to the database using the `dbConnect` function
    await dbConnect();

    // / Get the server session using the `getServerSession` function and the `authOptions` object
    const session = await getServerSession(authOptions);

    // Extract the `user` property from the session object
    const user: User = session?.user;

    // Check if the session and user objects exist
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    // Convert the `_id` property of the `user` object to a `mongoose.Types.ObjectId` object
    const userId = new mongoose.Types.ObjectId(user._id); // Convert


    try {
        // Use the `UserModel` to perform an aggregation query on the `users` collection
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, // // The query matches documents with the specified `_id` value.
            { $unwind: '$messages' }, // Unwinding the messages array field in each document
            { $sort: { 'messages.createdAt': -1 } }, // Sorts the resulting documents by the `createdAt` property of the `messages` field in descending order.
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }, // Group the documents by their `_id` field and accumulate an array of messages for each group
        ])


        if (!user) {
            return Response.json(
                // Error found
                { message: 'User zzzz not found', success: false },
                { status: 404 }
            );
        }

        return Response.json(
            { messages: user[0]?.messages },// Error found
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }


}

