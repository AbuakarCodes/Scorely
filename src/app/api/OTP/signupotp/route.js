
import { connectDB } from "@/lib/db";
import { generateOTP } from "@/Server/utils/OTP/genrateOTP";
import { sendOTP_email } from "@/Server/utils/OTP/sendOTP_email";
import { savingOTP_DB } from "@/utils/OTP/savingOTP_DB";
import { NextResponse } from "next/server"; 
import User from "@/Server/models/user";
import { ErrorResponse, SuccessResponse } from "@/Server/Response/response";

export async function POST(req) {
    try {
        connectDB()
        const { email, otp_id } = await req.json();

        if (!email, !otp_id) return new Response(JSON.stringify({ error: "Email and OTP id both are required" }), { status: 500 });

        const user = await User.findOne({ email })
        if (user) return NextResponse.json(new ErrorResponse("User already existed"), { status: 409 });

        const otp = generateOTP()
        await savingOTP_DB(otp, otp_id, email)

        await sendOTP_email(email, otp)
        return NextResponse.json(new SuccessResponse("OTP send sccessfully"), { status: 200 });
    } catch (err) {
        console.log(err.message)
        return NextResponse.json(new ErrorResponse("Failed to send OTP"), { status: 500 });
    }
}