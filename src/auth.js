


import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

import bcrypt from "bcrypt"
import { connectDB } from "./lib/db"
import User from "./Server/models/user"

// import NextAuth from "next-auth"
// import { connectDB } from "./lib/db"
// import User from "../src/Server/models/user.js"
// import bcrypt from "bcrypt"
// import Google from "next-auth/providers/google"
// import Github from "next-auth/providers/github"
// import Credentials from "next-auth/providers/credentials"


// export const {
//   handlers,
//   signIn,
//   signOut,
//   auth,
// } = NextAuth({

//   session: {
//     strategy: "jwt",
//     maxAge: 60 * 24 * 60 * 60,
//     updateAge: 0
//   },

//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//     }),

//     Github({
//       clientId: process.env.AUTH_GITHUB_ID,
//       clientSecret: process.env.AUTH_GITHUB_SECRET,
//     }),

//     Credentials({
//       name: "credentials",

//       credentials: {
//         email: {},
//         password: {},
//       },

//       async authorize(credentials) {
//         await connectDB()

//         const user = await User.findOne({
//           email: credentials.email,
//         })

//         if (!user) {
//           throw new Error("User not found")
//         }

//         const isPasswordCorrect = await bcrypt.compare(
//           credentials.password,
//           user.password
//         )

//         if (!isPasswordCorrect) {
//           throw new Error("Invalid password")
//         }

//         return {
//           id: user._id.toString(),
//           name: user.name,
//           email: user.email,
//           image: user.image,
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id,
//           token.name = user.name,
//           token.email = user.email
//       }

//       return token
//     },

//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id
//         session.user.name = token.name
//         session.user.email = token.email
//       }

//       return session
//     },

//     async signIn({ user, account }) {
//       if (
//         account.provider === "google" ||
//         account.provider === "github"
//       ) {
//         await connectDB()

//         const existingUser = await User.findOne({
//           email: user.email,
//         })

//         if (!existingUser) {
//           await User.create({
//             name: user.name,
//             email: user.email,
//             image: user.image,
//           })
//         }
//       }

//       return true
//     },
//   },

//   pages: {
//     signIn: "/auth/signin",
//     signUp: "/auth/signup"
//   },

//   secret: process.env.NEXTAUTH_SECRET,

// })









































// const authOptions = {
//     trustHost: true,
//     providers: [
//       GoogleProvider({
//         clientId: process.env.AUTH_GOOGLE_ID,
//         clientSecret: process.env.AUTH_GOOGLE_SECRET
//       }),

//       GitHubProvider({
//         clientId: process.env.AUTH_GITHUB_ID,
//         clientSecret: process.env.AUTH_GITHUB_SECRET
//       }),

//       CredentialsProvider({
//         name: "Credentials",
//         credentials: {
//           email: { label: "Email", type: "email" },
//           password: { label: "Password", type: "password" }
//         },

//         async authorize(credentials) {
//           await connectDB()
//           const user = await User.findOne({ email: credentials.email })

//           if (credentials.isSignUp) {
//             if (user) return null

//             const hashedPassword = await bcrypt.hash(credentials.password, 10) 

//             const newUser = await User.create({
//               name: credentials.name,
//               email: credentials.email,
//               password: hashedPassword,
//               avatar: null
//             })

//             return newUser
//           }

//           if (!user) return null

//           const valid = await bcrypt.compare(credentials.password, user.password)
//           if (!valid) return null

//           return user
//         }
//       })
//     ],

//     session: {
//       strategy: "jwt",
//       maxAge: 60 * 24 * 60 * 60,
//       updateAge: 0
//     },

//     callbacks: {
//       async redirect({ url, baseUrl }) {
//         // Normalize legacy/mis-cased signin redirects in production.
//         if (url === "/Signin" || url === "/signin") {
//           return `${baseUrl}/auth/signin`
//         }
//         if (url === "/Signout" || url === "/signout") {
//           return `${baseUrl}/Signout`
//         }

//         if (url.startsWith("/")) return `${baseUrl}${url}`
//         if (new URL(url).origin === baseUrl) return url
//         return baseUrl
//       },

//       async signIn({ user, account }) {
//         await connectDB()

//         if (account?.provider !== "credentials") {
//           const existingUser = await User.findOne({ email: user.email })

//           if (!existingUser) {
//             await User.create({
//               name: user.name,
//               email: user.email,
//               avatar: user.image || null
//             })
//           }
//         }

//         return true
//       },

//       async jwt({ token, user }) {
//         if (user) {
//           await connectDB()
//           const dbUser = await User.findOne({ email: user.email })

//           if (dbUser) {
//             token._id = dbUser._id.toString()
//             token.name = dbUser.name
//             token.email = dbUser.email
//             token.avatar = dbUser.avatar
//           }
//         } else {
//           await connectDB()
//           const existingUser = await User.findById(token._id)

//           if (!existingUser) {
//             token._id = null
//             token.invalid = true
//           }
//         }

//         return token
//       },

//       async session({ token, session }) {
//         if (!token?._id || token.invalid) {
//           return { ...session, user: null, expires: new Date(0).toISOString() }
//         }

//         await connectDB()
//         const dbUser = await User.findById(token._id)

//         if (!dbUser) {
//           return { ...session, user: null, expires: new Date(0).toISOString() }
//         }

//         session.user.id = dbUser._id.toString()
//         session.user.name = dbUser.name
//         session.user.email = dbUser.email
//         session.user.image = dbUser.avatar



//         return session
//       }
//     },

//     pages: {
//       signIn: "/auth/signin",
//       signUp: "/auth/signup"
//     },
//     secret: process.env.AUTH_SECRET,
//   } 

// export const { handlers, signIn, signOut, auth } = NextAuth(authOptions)







































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

        const user = await User.findOne({
          email: credentials.email,
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




  //   async jwt({ token, user }) {
  //     if (user) {
  //       token.id = user.id
  //     }
  //     return token
  //   },

  //   async session({ session, token }) {
  //     if (session.user) {
  //       session.user.id = token.id
  //     }
  //     return session
  //   },
  // },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await connectDB()
        const existing = await User.findOne({ email: user.email })
        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          })
        }
      }
      return true
    },


    async jwt({ token, user }) {
      if (user) {
        await connectDB()
        const dbUser = await User.findOne({ email: user.email })
        if (dbUser) {
          token.id = dbUser._id.toString()
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }
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