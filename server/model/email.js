require("dotenv").config();
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const ForgotPasswordMail = async (name, email, token, link, message) => {
  console.log("forgot password mail called");
  const config = {
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  var mailGenerator = new Mailgen({
    theme: "salted",
    product: {
      // Appears in header & footer of e-mails
      name: "RentHub",
      link: "https://www.nu.edu.pk/",
      // logo: 'https://khi.nu.edu.pk/wp-content/uploads/2023/01/FAST-NU-logo.png'
    },
  });

  var emailDetails = {
    body: {
      name: name,
      intro: `We received a request to reset your password. Use the below verification code to reset it: <br><br> Verification Code: ${token}`,
      outro:
        "If you did not request a password reset, please ignore this email. This link is valid for the next 5 minutes.",
      action: {
        instructions: message,
        button: {
          color: "#22BC66", // Optional action button color
          text: "Reset Password",
          link: link,
        },
      },
    },
  };

  var emailBody = mailGenerator.generate(emailDetails);

  if (!email) {
    res.status(404).json({ message: "Email Required" });
  } else {
    try {
      const emailText = {
        from: process.env.NODEMAILER_EMAIL, // sender address
        to: email, // list of receivers
        subject: "Password Reset Request", // Subject line
        html: emailBody, // html body
      };
      await transporter.sendMail(emailText);
      console.log("Successfully Send Mail");
    } catch (error) {
      console.log(error);
    }
  }
};
const SuccessForgotPasswordMail = async (email, message) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  var mailGenerator = new Mailgen({
    theme: "salted",
    product: {
      name: "RentHub",
      link: "https://www.nu.edu.pk/",
      // logo: "https://khi.nu.edu.pk/wp-content/uploads/2023/01/FAST-NU-logo.png",
    },
  });

  var emailDetails = {
    body: {
      intro: "Your password has been successfully reset.",
      outro:
        "If you have any questions or need further assistance, feel free to contact us.",
    },
  };

  var emailBody = mailGenerator.generate(emailDetails);

  if (!email) {
    return "email is required";
  } else {
    try {
      const emailText = {
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Password Reset Successful",
        html: emailBody,
      };
      await transporter.sendMail(emailText);
      console.log("Successfully Send Mail");
    } catch (error) {
      console.log(error);
    }
  }
};
module.exports = { ForgotPasswordMail, SuccessForgotPasswordMail };
