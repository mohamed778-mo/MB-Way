const express = require("express")
const router = express.Router()
const Employee = require("../models/employee_model");
const Admin = require("../models/admin_model")

const{forgetPassword,resetPassword}=require("../controllers/forgetpassword_control")


router.post('/forgetpassword',forgetPassword)

router.get('/resetpassword/:token', async (req, res) => {
  const token = req.params.token;

  const user = await Employee.findOne({ passwordResetToken: token }) || await Admin.findOne({ passwordResetToken: token });

  if (!user) {
    return res.status(400).send('Invalid token or token has expired.');
  }

  res.send(`
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password</title>
  <style>
    body {
      margin: 0;
      height: 100vh;
      font-family: 'Roboto', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(to right,  #2575fc, #6a11cb);
    }

    .container {
      background: rgba(255, 255, 255, 0.9);
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 450px;
      text-align: center;
    }

    h1 {
      color: #333;
      font-size: 28px;
      margin-bottom: 25px;
    }

    label {
      display: block;
      font-size: 16px;
      color: #444;
      margin-bottom: 10px;
      text-align: left;
    }

    input[type="password"] {
      width: 100%;
      padding: 14px;
      font-size: 16px;
      border: 2px solid #ccc;
      border-radius: 8px;
      margin-bottom: 20px;
      transition: border-color 0.3s ease;
    }

    input[type="password"]:focus {
      border-color: #4e54c8;
      outline: none;
    }

    button {
      width: 100%;
      padding: 14px;
      background-color: #4e54c8;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 18px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
    }

    button:hover {
      background-color: #2575fc;
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <form action="/app/user/resetpassword/${token}" method="POST">
      <label for="password">New Password:</label>
      <input type="password" name="password" id="password" required />
      <button type="submit">Reset Password</button>
    </form>
  </div>
</body>
</html>
  `);
});

  

router.post('/resetpassword/:token',resetPassword)

module.exports = router;
