const nodemailer = require("nodemailer");
const Employee = require("../models/employee_model");
const crypto = require("crypto");

require("dotenv").config();


const forgetPassword = async (req, res) => {
    try {
      const user = req.body;
      const dubUser = await Employee.findOne({ email: user.email });
      if (!dubUser) {
        return res
          .status(404)
          .json(" email is not exist , please write a correct email ");
      }
      const SEKRET = process.env.SECRET;
      console.log(SEKRET);
      const resettoken = crypto.randomBytes(32).toString("hex");
      dubUser.passwordResetToken = crypto
        .createHmac("sha256", SEKRET)
        .update(resettoken)
        .digest("hex");
  
      const token = dubUser.passwordResetToken;
      await dubUser.save();
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        service: process.env.SERVICE,
        secure: true,
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASS,
        },
      });
      const Message = `http://localhost:3000/app/user/resetpassword/${token}`;
  
      async function main() {
        const info = await transporter.jsonMail({
          from: process.env.USER_EMAIL,
          to: dubUser.email,
          subject: " RESET PASSWORD ",
          html: `<P>hello ${dubUser.email} go to link ${Message} for "RESET PASSWORD" </P> <P> expires after 1h !!</P>`,
        });
  
        console.log("Message sent");
      }
  
      main().catch(console.error);
  
      res.status(200).json(" check your email to reset password !");
    } catch (error) {
      res.status(500).json(error.message);
    }
  };
  
  
  const resetPassword = async (req, res) => {
    try {
      const { password } = req.body;  
      const token = req.params.token;  
  
      
      const user = await Employee.findOne({
        passwordResetToken: token,
      });
  
      if (!user) {
        return res.status(400).json('Token expired or invalid. Please try again.');
      }
  
     
      user.password = password;
      user.passwordResetToken = undefined;  
      user.passwordChangedAt = Date.now();  
  
   
      await user.save();
  
     
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Password Changed Successfully</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: 'Roboto', sans-serif;
              background: radial-gradient(circle at top,  #6a11cb, #2575fc);
              background-size: cover;
            }
  
            .container {
              background: rgba(255, 255, 255, 0.85);
              padding: 50px;
              border-radius: 20px;
              box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
              text-align: center;
              max-width: 400px;
              width: 100%;
              backdrop-filter: blur(12px);
            }
  
            .success-icon {
              font-size: 64px;
              color: #28a745;
              margin-bottom: 20px;
            }
  
            .message {
              font-size: 20px;
              color: #333;
            }
  
            .message p {
              margin: 0;
              line-height: 1.5;
            }
  
            .back-button {
              display: inline-block;
              margin-top: 20px;
              padding: 12px 20px;
              font-size: 16px;
              font-weight: 500;
              color: #ffffff;
              background: linear-gradient(to right,  #6a11cb, #2575fc);
              border: none;
              border-radius: 30px;
              text-decoration: none;
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
              transition: background 1.5s ease, transform 0.3s ease, box-shadow 0.3s ease;
              cursor: pointer;
            }
  
            .back-button:hover {
              transform: translateY(-1px);
              background: linear-gradient(to right,  #6a11cb, #2575fc);
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">
              &#10004;
            </div>
            <div class="message">
              <p>Your password has been successfully changed!</p>
            </div>
            <a href="https://mb-way-iota.vercel.app/" class="back-button">Back to Website</a>
          </div>
        </body>
        </html>
      `);
    } catch (e) {
     
      console.error(e);  
      res.status(500).json('Server error.');
    }
  };
  

  module.exports = { forgetPassword, resetPassword };
