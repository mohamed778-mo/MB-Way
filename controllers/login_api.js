const Admin = require("../models/admin_model");
const Employee = require("../models/employee_model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const generateTokenAndSetCookie = (res, userId) => {
  const SECRETKEY = process.env.SECRETKEY;
  if (!SECRETKEY) {
    throw new Error("SECRETKEY is not defined in environment variables");
  }

  const token = jwt.sign({ id: userId }, SECRETKEY);
  res.cookie("access_token", `Bearer ${token}`, {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), 
    httpOnly: true,
  });
  return token;
};

const Login = async (req, res) => {
  try {
    const { role, email, password } = req.body;

    if (!role || !email || !password) {
      return res.status(400).json( "All fields are required" );
    }

    let user;
    if (role === "Admin") {
      user = await Admin.findOne({ email });
    } else if (role === "Employee") {
      user = await Employee.findOne({ email });
    } else {
      return res.status(400).json( "Invalid role" );
    }

    if (!user) {
      return res.status(401).json( "Invalid email or password" );
    }

    if (role === "Employee") {
      if (user.isBlock) {
        return res.status(403).json( "You are blocked" );
      }

      if (!user.verified) {
        return res.status(400).json( "Please wait for verification" );
      }
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json( "Invalid email or password" );
    }

    const token = generateTokenAndSetCookie(res, user._id);

    if (!user.tokens) {
      user.tokens = [];
    }
    user.tokens.push(token);

    await user.save();

    res.status(200).json({
      access_token: `Bearer ${token}`,
      success: "Login successful",
      user:user,
      role:role
    });
  } catch (error) {
    res.status(500).json( error.message );
  }
};


const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role; 

    let user;
    if (role === "Admin") {
      user = await Admin.findById(userId).select("-password -tokens -passwordResetToken"); 
    } else if (role === "Employee") {
      user = await Employee.findById(userId).select("-password -tokens -passwordResetToken");
    } else {
      return res.status(400).json("Invalid role");
    }

    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json(error.message);
  }
};



module.exports = { Login , getProfile};
