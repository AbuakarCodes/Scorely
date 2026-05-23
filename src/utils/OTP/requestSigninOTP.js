import axios from "axios";

export const requestSigninOTP = async (email, otp_id) => {
    try {
        const response = await axios.post("/api/OTP/signupotp", { email, otp_id })
        return response
    } catch (err) {
        throw new Error(err.response?.data?.message || "Failed to request OTP")
    }
};