const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "workify0504@gmail.com",
    pass: "nljevrlgcpidbutn",
  },
});

module.exports = transporter;