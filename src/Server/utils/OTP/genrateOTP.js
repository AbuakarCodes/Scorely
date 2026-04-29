export function generateOTP() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let otp = ''
    for (let i = 0; i < 6; i++) {
        otp += chars[Math.floor(Math.random() * chars.length)]
    }
    return otp
}