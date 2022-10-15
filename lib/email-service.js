const nodemailer = require("nodemailer")
const cron = require('node-cron');
const schedule = require("node-schedule");

const cronEmailer = ({ to, subject, text, html }) => {
    if (!to)
        throw new Error("Emailer needs recipient email. `to` parameter is missing")

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "chumbucket.library@gmail.com",
            pass: "jwsgruhecwoeamnb"
        },
    })

    // let rule = new schedule.RecurrenceRule();
    // rule.minute = 5

    // let sendmail = schedule.scheduleJob(rule,

    // )

    cron.schedule('0 */1 * * * *', () => {

        transporter.sendMail({
            to,
            subject,
            text,
            html,
        })
    })
}

module.exports = cronEmailer