const Admin = require("../models/admin_model");
const Employee = require("../models/employee_model");
const DoneTask =require("../models/done_task_upload")
const Task=require("../models/task_model")
const Chat = require('../models/chat');

const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("nodemailer");
require("dotenv").config();



const Register = async (req, res) => {
  try {
    const file = req.files?.find(f => f.fieldname === 'file');

         let link ;
         console.log(file)
         if (file) {
            link = `http://localhost:3000/uploads/${file.filename}`;
        }else {link = null;}

    const user = req.body;
    const dublicatedEmail = await Admin.findOne({ email: user.email });
    if (dublicatedEmail) {
      return res.status(400).json("Email already exist!!");
    }
    const newUser = new Admin({...user,photo:link});

    await newUser.save();

  
    res.status(200).json("Register is success !!");
  } catch (error) {
    res.status(500).json(error.message);
  }
};


const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Admin.findOne({ email: email });
    if (!user) {
      return res.status(404).json("EMAIL OR PASSWORD NOT CORRECT ");
    }
    const isPassword = await bcryptjs.compare(password, user.password);
    if (!isPassword) {
      return res.status(404).json("EMAIL OR PASSWORD NOT CORRECT ");
    }

    const SECRETKEY = process.env.SECRETKEY;
    const token =  jwt.sign({ id: user._id }, SECRETKEY);
    res.cookie("access_token", `Bearer ${token}`, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1024 * 30),
      httpOnly: true,
    });

    user.tokens.push(token);
    user.save();
  
    res
      .status(200)
      .json({ access_token: `Bearer ${token}`, success: "Login is success!" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const get_employee_not_verified = async(req,res) => {
  try{
    const users = await Employee.find({ verified: false });
    if (!users) {
      return res.status(404).json("No employees found!");
    }
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(e.message);
  }
}
const verifyEmployeeEmail = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const user = await Employee.findByIdAndUpdate(employee_id,{ verified: true ,new:true});
    if (!user) {
      return res.status(404).json("User not found!");
    }
   await user.save();
    res.status(200).json("Email is verified!");
  } catch (e) {
    res.status(500).json(e.message);  
  }
};

const remove_verifyEmployeeEmail = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;
    const user = await Employee.findByIdAndUpdate(employee_id,{ verified: false ,new:true});
    if (!user) {
      return res.status(404).json("User not found!");
    }
   await user.save();
    res.status(200).json("Email is Not_verified!");
  } catch (e) {
    res.status(500).json(e.message);  
  }
};
const getEmployee = async (req, res) => {
  try {
    const employee_id  = req.params.employee_id;
    if (!mongoose.Types.ObjectId.isValid(employee_id)) {
      return res.status(400).json(" ID is not correct!");
    }
    const user = await Employee.findById(employee_id);
    if (!user) {
      return res.status(404).json(" please SignUp ");
    }
    res.status(200).json(user);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const getAllEmployee = async (req, res) => {
  try {
    const allData = await Employee.find();
    res.status(200).json(allData);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const editAdminData = async (req, res) => {
  try {
    const id = req.user._id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json("ID is not correct!!");
    }
    const data=await Admin.findById(id)
    if (!data) {
      return res.status(404).json("User not found!");
    }
    const file = req.files?.find(f => f.fieldname === 'file');
         let link ;
       
         if (file) {
            link = `http://localhost:3000/uploads/${file.filename}`;
            
             await Admin.findByIdAndUpdate(id,{...req.body,photo:link, new: true })
            await data.save();

            return res.status(200).json("Data updated successfully!");

        }

  

        await Admin.findByIdAndUpdate(id,{...req.body,new: true })
        await data.save();
    res.status(200).json("Data updated successfully!");
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const get_all_done_tasks = async (req, res) => {
  try {
    const user_data = await Admin.findById(req.user._id);
      
    if (!user_data.isAdmin ) {
          return res.status(400).json('You are not a Admin!');
      }

   const all_tasks = await DoneTask.find()
   
    res.status(200).json(all_tasks);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const get_det_done_task = async (req, res) => {
  try {
    const task_id=req.params.task_id
    const user_data = await Admin.findById(req.user._id);
      
    if (!user_data.isAdmin ) {
          return res.status(400).json('You are not a Admin!');
      }

   const done_task = await DoneTask.findById(task_id)
   
    res.status(200).json(done_task);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const get_tasks_nearly_not_done = async (req, res) => {
  try {
    const date = new Date();

  
    const tasks = await Task.find({
      $expr: {
        $gte: [
          {
            $divide: [
              { 
                $subtract: [ 
                  date, 
                  { $dateFromString: { dateString: "$from" } } 
                ] 
              },
              { 
                $subtract: [ 
                  { $dateFromString: { dateString: "$to" } }, 
                  { $dateFromString: { dateString: "$from" } } 
                ] 
              }
            ]
          },
          0.75 
        ]
      }
    });

    if(!tasks){return res.status(200).json([])}
    res.status(200).json(tasks,date);
  } catch (e) {
    
    res.status(500).json(e.message);
  }
};





const add_access_manager=async (req, res) => {

  try {
    const user_data = await Admin.findById(req.user._id);
      
    if (!user_data.isAdmin ) {
          return res.status(400).json('You are not a Admin!');
      }

      const employee_id = req.params.employee_id
      const employee_data = await Employee.findById(employee_id);
      
      if (!employee_data) {
        return res.status(404).json('Employee not found!');
      }
     
      await Employee.findByIdAndUpdate(employee_id,{isManager: true,new:true})

      await employee_data.save()

       res.status(200).json(`${employee_data.name} is now a manager !!`);


    }catch (e) {
    res.status(500).json(e.message);}
}

const remove_access_manager=async (req, res) => {

  try {
    const user_data = await Admin.findById(req.user._id);
      
    if (!user_data.isAdmin ) {
          return res.status(400).json('You are not a Admin!');
      }

      const employee_id = req.params.employee_id
      const employee_data = await Employee.findById(employee_id);
      
      if (!employee_data) {
        return res.status(404).json('Employee not found!');
      }
     
      await Employee.findByIdAndUpdate(employee_id,{isManager: false,new:true})

      await employee_data.save()

       res.status(200).json(`${employee_data.name} is now a not_manager !!`);


    }catch (e) {
    res.status(500).json(e.message);}
}

const deleteEmployee = async (req, res) => {
  try {
    const  employeeId  = req.params.employee_id;

   
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json('Employee not found!');
    }

   
    await Task.updateMany(
      { employees_id: employeeId },
      { $pull: { employees_id: employeeId } }
    );

    
    await DoneTask.updateMany(
      {},
      { $pull: { attachment: { employee_id: employeeId } } }
    );

   
    await Chat.deleteMany({ 
      $or: [
        { jsoner: employeeId }, 
        { receiver: employeeId }
      ]
    });


    await Employee.findByIdAndDelete(employeeId);

    res.status(200).json('Employee deleted successfully.');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteDoneTask = async (req, res) => {
  try {
    const  doneTaskId  = req.params.task_id;

    
    const doneTask = await DoneTask.findById(doneTaskId);
    if (!doneTask) {
      return res.status(404).json('DoneTask not found!');
    }

    
    await DoneTask.findByIdAndDelete(doneTaskId);

    res.status(200).json('DoneTask deleted successfully.');
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const add_block=async (req, res) => {

  try {
    const user_data = await Admin.findById(req.user._id);
      
    if (!user_data.isAdmin ) {
          return res.status(400).json('You are not a Admin!');
      }

      const employee_id = req.params.employee_id
      const employee_data = await Employee.findById(employee_id);
      
      if (!employee_data) {
        return res.status(404).json('Employee not found!');
      }
     
      await Employee.findByIdAndUpdate(employee_id,{isBlock: true,new:true})

      await employee_data.save()

       res.status(200).json(`${employee_data.name} is now BLOCKED !!`);


    }catch (e) {
    res.status(500).json(e.message);}
}

const remove_block=async (req, res) => {

  try {
    const user_data = await Admin.findById(req.user._id);
      
    if (!user_data.isAdmin ) {
          return res.status(400).json('You are not a Admin!');
      }

      const employee_id = req.params.employee_id
      const employee_data = await Employee.findById(employee_id);
      
      if (!employee_data) {
        return res.status(404).json('Employee not found!');
      }
     
      await Employee.findByIdAndUpdate(employee_id,{isBlock: false,new:true})

      await employee_data.save()

       res.status(200).json(`${employee_data.name} is now a NOT_BLOCKED !!`);


    }catch (e) {
    res.status(500).json(e.message);}
}
const delete_all_taskings= async(req,res)=>{
  try{
 await Task.deleteMany()
 res.status(200).json('All Tasking deleted successfully!')
  }catch(e){res.status(500).json(e.message)}
}

const get_employees_ref_section = async (req, res) => {
  try {
    const section_name = req.body.section_name;
    const sectionToLowerCase = section_name.toLowerCase();
    const employees = await Employee.find({ section: sectionToLowerCase });
    res.status(200).json(employees);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const edit_in_employee_data = async(req, res)=> {
  try {
    const employee_id=req.params.employee_id;
    const user_data = await Employee.findByIdAndUpdate(employee_id ,{...req.body, new: true });

    if (!user_data) {
      return res.status(404).json('Employee not found!');
    }
    await user_data.save();
    res.status(200).json(user_data);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const get_det_notdone_task = async (req, res) => {
  try {
    const task_id=req.params.task_id

   const notdone_task = await Task.findById(task_id)
   
    res.status(200).json(notdone_task);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const delete_nearly_Task = async (req, res) => {
  try {

  

    const taskId = req.params.task_id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json("Task not found!");
    }

    await Employee.updateMany(
      { _id: { $in: task.employees_id } }, 
      { $pull: { task_notdone: taskId } }  
    );

   
    await Task.findByIdAndDelete(taskId);

    res.status(200).json("Task deleted successfully.");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const update_task = async (req, res) => {
    try {
        const { push_employees_id, remove_employees_id, task_date, from, to, task_heading, task_description } = req.body;
        const task_id = req.params.task_id;

        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json('Task not found');
        }

 
        if (push_employees_id) {
            const newEmployees = await Employee.find({ _id: { $in: push_employees_id } }).select('name role photo');
            const formattedEmployees = newEmployees.map((employee) => ({
                employee_id: employee._id,
                name: employee.name,
                role: employee.role,
                photo: employee.photo,
            }));

            await Task.findByIdAndUpdate(task_id, {
                $addToSet: { employees: { $each: formattedEmployees } },
            });

            await Employee.updateMany(
                { _id: { $in: push_employees_id } },
                { $push: { task_notdone: task._id } }
            );
        }


        if (remove_employees_id) {
            await Task.findByIdAndUpdate(task_id, {
                $pull: { employees: { employee_id: { $in: remove_employees_id } } },
            });

            await Employee.updateMany(
                { _id: { $in: remove_employees_id } },
                { $pull: { task_notdone: task._id } }
            );
        }

        if (task_date) task.task_date = task_date;
        if (from) task.from = from;
        if (to) task.to = to;
        if (task_heading) task.task_heading = task_heading;
        if (task_description) task.task_description = task_description;

        await task.save();

        res.status(200).json('Task updated successfully!');
    } catch (e) {
        console.error('Error:', e.message);
        res.status(500).json(e.message);
    }
};



module.exports = {
    Register,
    Login,
    getEmployee,
    getAllEmployee,
    editAdminData,
    get_tasks_nearly_not_done,
    get_all_done_tasks,
    get_det_done_task,
    add_access_manager,
    remove_access_manager,
    deleteEmployee,
    deleteDoneTask,
    add_block,
    remove_block,
    delete_all_taskings,
    get_employee_not_verified,
    verifyEmployeeEmail,
   remove_verifyEmployeeEmail,
   get_employees_ref_section,
   edit_in_employee_data,
  delete_nearly_Task,
  get_det_notdone_task,
  update_task
    
   

}
