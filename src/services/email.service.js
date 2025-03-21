const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../config/logger");


const transport = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "looser1276@gmail.com",
    pass: "ikrczsofuuzfyvgx"
  }
});


if (config.env !== "test") {
  transport
    .verify()
    .then(() => logger.info("Connected to email server"))
    .catch(() =>
      logger.warn(
        "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
      )
    );
}





const sendEmail = async (to, subject, html) => {
    const msg = { from:"looser1276@gmail.com", to, subject, html };
    return await transport.sendMail(msg);
};


const sendWelcomeMail = async (user) => {
    const subject = 'Welcome to Annai';
    const html = `
   Hi ${user.first_name} ${user.last_name},<br/>
    
    We are happy to see you at our Job portal! <b>${user.auth_code} <b> is your verification code.<br/>

  Team Annai.`
    await sendEmail(user.email, subject, html);
};

const sendOtpEmail = async (user, OTP,msg) => {
  const subject = 'Annai - Verification Code';
  const html = `Dear ${user.first_name} ${user.last_name},
  
  <b>${OTP} </b> ${msg} <br/>


  Team Annai.`;
  await sendEmail(user.email, subject, html);
};
module.exports = {
    sendEmail,
    sendWelcomeMail,
    sendOtpEmail
};