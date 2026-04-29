import bcrypt from 'bcrypt'
import { connectDB } from "@/lib/db";
import OTP from "@/Server/models/OTPschema";
import { NextResponse } from 'next/server';
import { ErrorResponse, SuccessResponse } from '@/Server/Response/response';

export async function POST(req) {
    try {
        connectDB()
        const { email, otp_id, otp } = await req.json();

        if (!email || !otp_id || !otp) return NextResponse.json(new ErrorResponse("Email OTP and OTP id  are required"), { status: 500 });

        const otp_DB = await OTP.findOne({ userEmail: email, OTP_id: otp_id })
        if (!otp_DB) return NextResponse.json(new ErrorResponse("An unexpected error occure"), { status: 500 })

        const isOTPmatched = await bcrypt.compare(otp, otp_DB.OTPcode)

        if (isOTPmatched) {
            OTP.deleteOne({ userEmail: email, OTP_id: otp_id })
            return NextResponse.json(new SuccessResponse("OTP verified"), { status: 200 })
        }


        return NextResponse.json(new ErrorResponse("Invalid OTP"), { status: 400 })


    } catch (err) {
        console.log(err?.message)
        return NextResponse.json(new ErrorResponse(err?.message || "Something went wrong"), { status: 400 })

    }
}