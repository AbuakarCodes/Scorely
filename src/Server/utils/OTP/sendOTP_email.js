import { transporter } from "./nodeMailerTransport"
import { otpHTML } from "./otpHTML"

export async function sendOTP_email(reciever, OTP) {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_SENDER,
            to: reciever,
            subject: "Hello ✔",
            text: OTP,
            html: otpHTML(OTP),
        })
        return info
    } catch (error) {
        console.log(error)
        throw new Error("Email sending failed") 
    }
}