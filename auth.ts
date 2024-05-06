import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "./lib/db-connect"
import { UserModel } from "./model/user.model"



// export const BASE_PATH = "/api/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // basePath:BASE_PATH,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },

      authorize: async (credentials: any): Promise<any> => {
        await dbConnect()

        try {
          // logic to verify if user exists
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.email },
              { username: credentials.email },
            ]
          })

          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
          }

          // logic to salt and hash password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrect) {
            // return user object with the their profile data
            return user
          } else {
            throw new Error('Incorrect password');

          }

        } catch (err: any) {
          throw new Error(err);
        }

      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) { // User is available during sign-in
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.username = user.username
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token
    },

    session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session
    },
  },

  // session: {
  //   strategy: 'jwt'
  // },

  secret: process.env.AUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },
})
