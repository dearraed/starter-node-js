const nodemailer =require('nodemailer');
const mailing = require('../config');

const sendEmail = async options => {

const transporter = nodemailer.createTransport({
  host: mailing.host,
  port: mailing.port,
  auth:{
    user: mailing.auth.user,
    pass: mailing.auth.pass
  }
})
const mailOptions = {
  from:"Test",
  to:options.email,
  subject:options.subject,
  text:options.message
}

await transporter.sendMail(mailOptions);

}

module.exports = sendEmail;