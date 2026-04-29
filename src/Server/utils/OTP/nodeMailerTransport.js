import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  

    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.NODEMAILER_PASS,
    },
});


export { transporter }