import bcrypt from "bcrypt"
import OTP from "@/Server/models/OTPschema"

export async function savingOTP_DB(otp, OTP_id, email) {
    if (!otp || !OTP_id || !email) {
        throw new Error("otp, OTP_id, email are required")
    }

    try {
        const hashedOTP = await bcrypt.hash(otp, 10)

        await OTP.create({
            OTP_id: OTP_id,
            userEmail: email,
            OTPcode: hashedOTP,
            isUsed: false
        })

    } catch (error) {
        console.error(error)
        throw new Error(error?.message || "Something went wrong")
    }
}