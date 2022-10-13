const nodemailer = require("nodemailer")

const emailer = async ({ to, subject, text, html }) => {
    if (!to)
        throw new Error("Emailer needs recipient email. `to` parameter is missing")

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "chumbucket.library@gmail.com",
            pass: "jwsgruhecwoeamnb"
        },
    })

    await transporter.sendMail({
        to,
        subject,
        text,
        html,
    })
}

module.exports = emailer