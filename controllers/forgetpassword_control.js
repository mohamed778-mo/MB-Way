const nodemailer = require("nodemailer");
const Employee = require("../models/employee_model");
const Admin =require("../models/admin_model")

const crypto = require("crypto");

require("dotenv").config();


const forgetPassword = async (req, res) => {
  try {
      const user = req.body;
      
      
      let foundUser = await Employee.findOne({ email: user.email });
      
      
      if (!foundUser) {
          foundUser = await Admin.findOne({ email: user.email });
      }

      if (!foundUser) {
          return res.status(404).json("Email is not found, please enter a correct email.");
      }

      const SEKRET = process.env.SECRET;
      const resettoken = crypto.randomBytes(32).toString("hex");

      foundUser.passwordResetToken = crypto
          .createHmac("sha256", SEKRET)
          .update(resettoken)
          .digest("hex");

      const token = foundUser.passwordResetToken;
      await foundUser.save();

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

      await transporter.sendMail({
          from: process.env.USER_EMAIL,
          to: foundUser.email,
          subject: "RESET PASSWORD",
          html: `<p>Hello ${foundUser.email}, click the link below to reset your password:</p>
                 <p><a href="${Message}">${Message}</a></p>
                 <p>This link expires after 1 hour.</p>`,
      });

      res.status(200).json("Check your email to reset password!");
  } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
  }
};

  
  
const resetPassword = async (req, res) => {
  try {
      const { password } = req.body;
      const token = req.params.token;

      
      let user = await Employee.findOne({ passwordResetToken: token });

      
      if (!user) {
          user = await Admin.findOne({ passwordResetToken: token });
      }

      if (!user) {
          return res.status(400).json('Token expired or invalid. Please try again.');
      }

      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordChangedAt = Date.now();

      await user.save();

      res.send(`
          <html>
          <head>
              <title>Password Reset Successful</title>
          </head>
          <body>
              <h2>Your password has been successfully changed!</h2>
              <a href="https://mb-way-iota.vercel.app/">Back to Website</a>
          </body>
          </html>
      `);
  } catch (e) {
      console.error(e);
      res.status(500).json('Server error.');
  }
};

  

  module.exports = { forgetPassword, resetPassword };
