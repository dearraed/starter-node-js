const nodemailer =require('nodemailer');
const { mailing } = require('../config');

const sendEmail = async options => {

//let testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
  host: mailing.host,
  port: mailing.port,
  auth:{
    user: mailing.user,
    pass: mailing.pass
  }
})



const mailOptions = {
  from: "<starer-js@noreplay.com>",
  to:options.email,
  subject:options.subject,
  text:options.message
}

await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;