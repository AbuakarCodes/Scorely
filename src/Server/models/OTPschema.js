import mongoose from "mongoose";

const OTPSchema = new mongoose.Schema({
    OTP_id: { type: String, required: true },
    userEmail: { type: String, required: true },
    OTPcode: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 190 }
});


const OTP = mongoose.models.OTP || mongoose.model("OTP", OTPSchema)

export default OTP