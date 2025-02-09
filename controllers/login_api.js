const Admin = require("../models/admin_model");
const Employee = require("../models/employee_model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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

const remove_my_account = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    const password = req.body.password;

    let userModel;
    if (role === "Admin") {
      userModel = Admin;
    } else if (role === "Employee") {
      userModel = Employee;
    } else {
      return res.status(400).json("Invalid role");
    }


    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

  
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json("Password not correct!");
    }

 
    await userModel.findByIdAndDelete(userId);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const editUserData = async (req, res) => {
  try {
    const id = req.user._id;
    const role = req.user.role; 
    let userModel;

  
    if (role === "Admin") {
      userModel = Admin;
    } else if (role === "Employee") {
      userModel = Employee;
    } else {
      return res.status(400).json("Invalid role!");
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json("ID is not correct!!");
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json("User not found!");
    }


    if (role === "Employee" && user.isBlock) {
      return res.status(403).json("You are BLOCKED!!");
    }

   
    if (role === "Admin" && !user.isAdmin) {
      return res.status(403).json("Not authorized!");
    }

 
    let link;
    const file = req.files?.find(f => f.fieldname === "file");
    if (file) {
      link = `http://localhost:3000/uploads/${file.filename}`;
    }

    
    const updatedData = { ...req.body };
    if (link) updatedData.photo = link;

    await userModel.findByIdAndUpdate(id, updatedData, { new: true });

    return res.status(200).json("Data updated successfully!");
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};



module.exports = { Login , getProfile , remove_my_account , editUserData};
