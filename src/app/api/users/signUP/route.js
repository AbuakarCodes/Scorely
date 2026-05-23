// app/api/auth/register/route.js

import { connectDB } from "@/lib/db"
import User from "@/Server/models/user"
import { SuccessResponse, ErrorResponse } from "@/Server/Response/response"
import bcrypt from "bcrypt"

export async function POST(req) {

    try {
        await connectDB()

        const body = await req.json()
        const { name, email, password } = body

        if (!name || !email || !password) {
            return Response.json(
                new ErrorResponse("Missing required fields"),
                { status: 400 }
            )
        }

        // check if user already exists
        const existing = await User.findOne({ email })
        if (existing) {
            return Response.json(
                new ErrorResponse("Email already in use"),
                { status: 409 }
            )
        }

        // hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })

        return Response.json(
            new SuccessResponse("User created successfully", {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: ""
            }),
            { status: 201 }
        )

    } catch (error) {
        console.log(error?.message || "Server error while creating user")

        return Response.json(
            new ErrorResponse("Server error while creating user"),
            { status: 500 }
        )
    }
}