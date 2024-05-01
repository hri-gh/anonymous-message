import { z } from "zod";


// *-------------*
// SignUp Schema
// *-------------*
export const UsernameValidation = z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(20, 'Username must be no more than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');

export const SignUpSchema = z.object({
    username: UsernameValidation,

    email: z.string().email({
        message: 'Invalid email address'
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters'
    }),
});


// *-------------*
// Verify Schema
// *-------------*
export const VerifySchema = z.object({
    code: z.string().length(6, 'Verification code must be 6 digits'),
});


// *-------------*
// SignIn Schema
// *-------------*
export const SignInSchema = z.object({
    identifier: z.string().min(1),  // We don't know if it is an email or a username yet
    password: z.string().min(1),
});


// *-------------------*
// AcceptMessage Schema
// *-------------------*
export const AcceptMessageSchema = z.object({
    acceptMessages: z.boolean(),
});


// *-------------------*
// Message Schema
// *-------------------*
export const MessageSchema = z.object({
    content: z
        .string()
        .min(10, { message: 'Content must be at least 10 characters.' })
        .max(300, { message: 'Content must not be longer than 300 characters.' }),
});
