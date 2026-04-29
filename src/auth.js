import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./lib/db"
import User from "../src/Server/models/user.js"
import bcrypt from "bcrypt"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),

    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        await connectDB()
        const user = await User.findOne({ email: credentials.email })

        if (credentials.isSignUp) {
          if (user) return null

          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const newUser = await User.create({
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
            avatar: null
          })

          return newUser
        }

        if (!user) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return user
      }
    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      await connectDB()

      if (account?.provider !== "credentials") {
        const existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          await User.create({
            name: user.name,
            email: user.email,
            avatar: user.image || null
          })
        }
      }

      return true
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email })

        if (dbUser) {
          token._id = dbUser._id.toString()
          token.name = dbUser.name
          token.email = dbUser.email
          token.avatar = dbUser.avatar
        }
      } else {
        await connectDB()
        const existingUser = await User.findById(token._id)

        if (!existingUser) {
          token._id = null
          token.invalid = true
        }
      }

      return token
    },

    async session({ token, session }) {
      if (!token?._id || token.invalid) return null

      await connectDB()
      const dbUser = await User.findById(token._id)

      if (!dbUser) return null

      session.user.id = dbUser._id.toString()
      session.user.name = dbUser.name
      session.user.email = dbUser.email
      session.user.image = dbUser.avatar

      

      return session
    }
  },

  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup"
  }
})