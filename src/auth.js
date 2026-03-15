import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectDB } from "./lib/db"
import User from "@/models/users/user.js"
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
          if (user) return

          const hashedPassword = await bcrypt.hash(credentials.password, 10)
          const newUser = await User.create({
            name: credentials.name,
            email: credentials.email,
            password: hashedPassword,
            image: null
          })
          return newUser
        }

        // login flow
        if (!user) return

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return

        return user
      }


    })
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider != "credentials") {
        await connectDB()
        const existingUser = await User.findOne({ email: user.email })
        if (!existingUser) {
          try {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image
            })
          } catch (error) {
            console.log("Failed to create user:", err?.message || "Error in OAuth callback while creating user")
            return false
          }
        }
      }
      return true
    },

    async session({ session, token }) {
      return session
    }
  },

  pages:{
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  }

})