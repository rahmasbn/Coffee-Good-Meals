const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SENDER, // generated ethereal user
    pass: process.env.PASSWORD_SENDER, // generated ethereal password
  },
});

exports.sendForgotPass = (email, data) => {
  console.log("data", data);
  console.log("email", email);
  return new Promise((resolve, reject) => {
    const message = {
      from: process.env.EMAIL_SENDER,
      to: email,
      subject: "Reset Password!",
      html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    * {
                        font-family: sans-serif;
                    }
                    .wrapper {
                            border: 1px solid #393939;
                            width: 90%;
                            margin-left: 5%;
                    
                    }
                    h2 {
                        text-align: center;
                        background: #ffba33;
                        line-height: 50px;
                        color: #6a4029;
                    }
                    .link {
                        display: inline-block;
                        width: 250px;
                        height: 40px;
                        line-height: 40px;
                        text-decoration: none;
                        color: #ffffff !important;
                        font-weight: bold;
                        text-align: center;
                        background: #c82022;
                        margin-left: 37%;
                        border-radius: 10px;
                    }
                    .link-1{
                        text-decoration: none;
                    }
                    .text {
                        margin-left: 30px;
                        margin-top: 6%;
                        margin-bottom: 5%;
                    }
                    .code {
                        color: blue;
                    }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <h2>Hi ${data.name !== null ? data.name + "," : ""}</h2>
                    <p class="text">    We already have your request to reset your account password.
                    Please enter this code <u class="code">${
                      data.otp
                    }</u> to reset your password.</p>
                </div>
            </body>
            </html>`,
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
