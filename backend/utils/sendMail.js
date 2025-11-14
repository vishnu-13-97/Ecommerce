const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendMail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Ecommerce App" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendMail;
