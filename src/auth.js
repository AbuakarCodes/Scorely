


import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import bcrypt from "bcrypt"
import { connectDB } from "./lib/db"
import User from "./Server/models/user"


export const authOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 24 * 60 * 60,
  },

  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),

    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB()

        if (!credentials.email || !credentials.password) throw new Error("email and password is required")

        const user = await User.findOne({
          email: credentials?.email,
        })

        if (!user) throw new Error("User not found")


        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isValid) throw new Error("Invalid password")

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],


  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        try {
          await connectDB()
          const existing = await User.findOne({ email: user?.email })
          if (!existing) {
            await User.create({
              name: user?.name,
              email: user?.email,
              image: user?.image,
            })
          }
        } catch (error) {
          console.error("OAuth sign-in DB error:", error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user }) {
      // When a user signs in with an OAuth provider (Google, GitHub, etc.),
      // NextAuth gives us their OAuth profile — which has no MongoDB _id.
      // So we query the DB by email to get our own user document,
      // and attach the real MongoDB _id to the token.
      // This ensures token.id is always a MongoDB _id, regardless of provider
      if (user) {
        await connectDB()
        const dbUser = await User.findOne({ email: user?.email })
        if (dbUser) {
          token.id = dbUser?._id?.toString()
          token.name = dbUser?.name
          token.email = dbUser?.email
        }
      }
      return token
    },

    async session({ session, token }) {
      session.user.id = token.id
      session.user.name = token.name
      session.user.email = token.email
      return session
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }