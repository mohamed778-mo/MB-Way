const jwt = require("jsonwebtoken");
const Employee = require("../models/employee_model");
const Admin = require("../models/admin_model");



const auth = async (req, res, Next) => {
  try {

    if (!req.headers) {
      return res.status(404).send(" please login !");
    }
  
    const token = req?.headers?.authorization.split(" ")[1]
    if (!token) {
      return res.status(401).send(" please login !");
    }

    const SECRETKEY = process.env.SECRETKEY;

    const result =  jwt.verify(token, SECRETKEY, { complete: true });

    if (!result) {
      return res.status(400).send(" please signup or login !");
    }

    let user;
    const userFromEmployee = await Employee.findById(result.payload.id);
    const userFromAdmin = await Admin.findById(result.payload.id);

    if (userFromEmployee) {
      
      user = userFromEmployee;
    } else if (userFromAdmin) {

      if(!userFromAdmin.isAdmin){
        return res.status(403).send("You are not Admin !!");
      }
      if(!userFromAdmin.isManager){
        return res.status(403).send("You are not Manager !!");
      }
      user = userFromAdmin;
    } else {
      return res.status(401).send("User not found");
    }

    req.user = user;
    req.token = token;

    
    Next();
  } catch (e) {
    res.status(500).send(e.message);
  }
};

module.exports = {
  auth,
};
