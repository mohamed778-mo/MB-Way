const express = require("express")
const router = express.Router()
const Employee = require("../models/employee_model");

const{forgetPassword,resetPassword}=require("../controllers/forgetpassword_control")


router.post('/forgetpassword',forgetPassword)

router.get('/resetpassword/:token', async (req, res) => {
    const token = req.params.token;
  
    const user = await Employee.findOne({
      passwordResetToken: token,
    });
  
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
      /* Base styles */
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

      /* Progress bar for password strength */
      .progress-bar {
        width: 100%;
        height: 8px;
        border-radius: 5px;
        margin-top: 5px;
        margin-bottom: 8px;

        background: #ddd;
        transition: background 0.5s ease;
      }

      .strength-bar {
        height: 100%;
        border-radius: 5px;
        width: 0;
        transition: width 0.5s ease;
      }

      /* Color transitions from red to green */
      .weak { background: red; }
      .fair { background: orange; }
      .good { background: yellow; }
      .strong { background: green; }

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

      .info {
        margin-top: 20px;
        color: #555;
        font-size: 14px;
      }

      .back-button {
        display: inline-block;
        margin-top: 30px;
        padding: 12px 24px;
        font-size: 16px;
        font-weight: 500;
        color: #fff;
        background: linear-gradient(to right,  #6a11cb, #2575fc);
        border-radius: 50px;
        text-decoration: none;
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }

      .back-button:hover {
        background: linear-gradient(to right,  #6a11cb, #2575fc);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
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
        
        <!-- Password strength progress bar -->
        <div class="progress-bar">
          <div id="strength-bar" class="strength-bar"></div>
        </div>
        
        <button type="submit">Reset Password</button>
      </form>
      <div class="info">
        <p>Please enter a password with at least 8 characters, including a number, uppercase and lowercase letters.</p>
      </div>
      <a href="https://mb-way-iota.vercel.app/" class="back-button">Back to Home</a>

    </div>

    <script>
      const passwordInput = document.getElementById('password');
      const strengthBar = document.getElementById('strength-bar');
      
      // Regular expressions for password validation
      const regexNumber = /\d/;
      const regexUppercase = /[A-Z]/;
      const regexLowercase = /[a-z]/;
      const regexMinLength = /^.{8,}$/;

      passwordInput.addEventListener('input', function() {
        let strength = 0;
        
        if (regexMinLength.test(passwordInput.value)) strength++;
        if (regexNumber.test(passwordInput.value)) strength++;
        if (regexUppercase.test(passwordInput.value)) strength++;
        if (regexLowercase.test(passwordInput.value)) strength++;

        // Update strength bar
        if (strength === 0) {
          strengthBar.style.width = '0%';
          strengthBar.className = 'strength-bar weak';
        } else if (strength === 1) {
          strengthBar.style.width = '25%';
          strengthBar.className = 'strength-bar weak';
        } else if (strength === 2) {
          strengthBar.style.width = '50%';
          strengthBar.className = 'strength-bar fair';
        } else if (strength === 3) {
          strengthBar.style.width = '75%';
          strengthBar.className = 'strength-bar good';
        } else if (strength === 4) {
          strengthBar.style.width = '100%';
          strengthBar.className = 'strength-bar strong';
        }
      });
    </script>
  </body>
</html>

    `);
  });
  

router.post('/resetpassword/:token',resetPassword)

module.exports = router;