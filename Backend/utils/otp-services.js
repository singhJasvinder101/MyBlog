const nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const otpTemplate=require('./otp-template')

const generateOTP = async (email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`Generated OTP is ${otp}`);
    return otp;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate OTP");
  }
};



const sendMail = async (email, otp) => {
  try {
    console.log(SMTP_EMAIL, SMTP_PASSWORD);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "OTP for password reset",
      html: otpTemplate(otp),
    };

    const response = await transporter.sendMail(mailOptions);
    console.log("Email sent with OTP",otp);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send OTP");
  }
};

module.exports = { generateOTP,sendMail };



  