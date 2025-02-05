const Admin = require("../models/admin_model");
const Employee = require("../models/employee_model");
const DoneTask =require("../models/done_task_upload")
const Task=require("../models/task_model")
const Chat = require('../models/chat');

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
    const dublicatedEmail = await Admin.findOne({ email: user.email }) || await Employee.findOne({ email: user.email })
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

const add_task = async (req, res) => {
  try {
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }
      const { task_heading, section, task_description,employees_id } = req.body;

    
      const employees = await Employee.find({ _id: { $in: employees_id } }).select('name role photo');

      const formattedEmployees = employees.map((employee) => ({
          employee_id: employee._id,
          name: employee.name,
          role: employee.role,
          photo: employee.photo,
      }));

      const new_task = new Task({
          task_heading,
          section,
          task_description,
          from: new Date(req.body.from),
          to: new Date(req.body.to),
          employees: formattedEmployees,
      });
      await new_task.save();

     
      await Employee.updateMany(
          { _id: { $in: employees_id } },
          { $push: { task_notdone: new_task._id } }
      );

      res.status(200).json('Task created and assigned successfully!');
  } catch (e) {
      res.status(500).json(e.message);
  }
};

const get_employee_not_verified = async(req,res) => {
  try{
   
  
    const user_data=  await Admin.findById(req.user._id);
  if(!user_data.isAdmin){

        return res.status(400).json('not Available!');
  }

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

   
    const user = await Employee.findByIdAndUpdate(employee_id, { verified: true }, { new: true });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.status(200).json("Email is verified!");
  } catch (e) {
    res.status(500).json(e.message);  
  }
};

const remove_verifyEmployeeEmail = async (req, res) => {
  try {
    const employee_id = req.params.employee_id;

   
    const user = await Employee.findByIdAndUpdate(employee_id, { verified: false }, { new: true });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    res.status(200).json("Email is Not verified!");
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

    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
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

   const all_tasks = await DoneTask.find()
   
    res.status(200).json(all_tasks);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const get_det_done_task = async (req, res) => {
  try {
    const task_id=req.params.task_id

   const done_task = await DoneTask.findById(task_id)
   
    res.status(200).json(done_task);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const get_tasks_nearly_not_done = async (req, res) => {
  try {

  
    const user_data=  await Admin.findById(req.user._id);
 
      if (!user_data.isAdmin) {
        return res.status(400).json('not Available!');
      }

    const currentDate = new Date();

    const tasks = await Task.find({
      from: { $lte: currentDate },
      to: { $gte: currentDate },   
      $expr: {
        $gte: [
          {
            $divide: [
              { $subtract: [currentDate, "$from"] }, 
              { $subtract: ["$to", "$from"] }       
            ]
          },
          0.7
        ]
      }
    });

    if (!tasks) {
      return res.status(200).json([]); 
    }

    res.status(200).json(tasks);
  } catch (e) {
    console.error("Error:", e.message);
    res.status(500).json({ error: e.message });
  }
};



const deleteDoneTask = async (req, res) => {
  try {
    let user_data;
  
    const admin=  await Admin.findById(req.user._id);
  if(!admin){
  
    user_data = await Employee.findById(req.user._id);
  }else{
    user_data = await Admin.findById(req.user._id);
  }
      if (!user_data.isManager) {
        return res.status(400).json('You are not ACCESS!');
      }
    const  doneTaskId  = req.params.task_id;
    
    const doneTask = await DoneTask.findById(doneTaskId);
    if (!doneTask) {
      return res.status(404).json('DoneTask not found!');
    }
const employees_id = doneTask.employees_id
    await Employee.updateMany(
      { _id: { $in: employees_id} }, 
      { $pull: { task_done: doneTaskId } }  
    );
    
    await DoneTask.findByIdAndDelete(doneTaskId);

    res.status(200).json('DoneTask deleted successfully.');
  } catch (error) {
    res.status(500).json(error.message);
  }
};



const deleteEmployee = async (req, res) => {
  try {
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }
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


const delete_all_not_done_taskings= async(req,res)=>{
  try{
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }
 await Task.deleteMany()
 res.status(200).json('All Tasking deleted successfully!')
  }catch(e){res.status(500).json(e.message)}
}
const delete_all_done_taskings= async(req,res)=>{
  try{
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }
 await DoneTask.deleteMany()
 res.status(200).json('All Tasking deleted successfully!')
  }catch(e){res.status(500).json(e.message)}
}

const get_employees_ref_section = async (req, res) => {
  try {
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }
    const section_name = req.body.section;
    const sectionToLowerCase = section_name.toLowerCase();
    const employees = await Employee.find({ section: sectionToLowerCase });
    res.status(200).json(employees);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const edit_employee_data = async (req, res) => {
  try {
    let user_data;

    const admin = await Admin.findById(req.user._id);
    if (!admin) {
      user_data = await Employee.findById(req.user._id);
    } else {
      user_data = await Admin.findById(req.user._id);
    }

    if (!user_data.isManager) {
      return res.status(400).json("Not Available!");
    }

    const employee_id = req.params.employee_id;
    const employee_data = await Employee.findById(employee_id);

    if (!employee_data) {
      return res.status(404).json("Employee not found!");
    }

    const { action, updateData } = req.body;

    switch (action) {
      case "add_manager":
        await Employee.findByIdAndUpdate(employee_id, { isManager: true });
        res.status(200).json(`${employee_data.name} is now a manager!`);
        break;

      case "remove_manager":
        await Employee.findByIdAndUpdate(employee_id, { isManager: false });
        res.status(200).json(`${employee_data.name} is no longer a manager!`);
        break;

      case "block":
        await Employee.findByIdAndUpdate(employee_id, { isBlock: true });
        res.status(200).json(`${employee_data.name} is now BLOCKED!`);
        break;

      case "unblock":
        await Employee.findByIdAndUpdate(employee_id, { isBlock: false });
        res.status(200).json(`${employee_data.name} is now UNBLOCKED!`);
        break;

      case "edit_data":
        if (updateData.from || updateData.to) {
          const from = updateData.from;
          const to = updateData.to;

          if (!from || !to) {
            return res
              .status(400)
              .json("Both from and to times are required for shift.");
          }

         
          const fromTime = parseTime(from);
          const toTime = parseTime(to);

          if (fromTime >= toTime) {
            return res
              .status(400)
              .json("Shift 'to' time must be after 'from' time.");
          }

          updateData.from = from
          updateData.to = to
        }

        await Employee.findByIdAndUpdate(employee_id, { $set: updateData });
        res.status(200).json(`${employee_data.name} data updated successfully!`);
        break;

      default:
        res.status(400).json("Invalid action!");
    }
  } catch (e) {
    res.status(500).json(e.message);
  }
};


function parseTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);


  if (hours >= 24) {
    date.setDate(date.getDate() + 1); 
    date.setHours(hours - 24);
  }

  return date;
}

const get_det_notdone_task = async (req, res) => {
  try {
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }

    const task_id=req.params.task_id

   const notdone_task = await Task.findById(task_id)
   
    res.status(200).json(notdone_task);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const delete_Task = async (req, res) => {
  try {

  let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }

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
        let user_data;

        const admin = await Admin.findById(req.user._id);
        if (!admin) {
            user_data = await Employee.findById(req.user._id);
        } else {
            user_data = await Admin.findById(req.user._id);
        }

        if (!user_data.isManager) {
            return res.status(400).json('Not Available!');
        }

        const {
            push_employees_id,
            remove_employees_id,
            task_date,
            from,
            to,
            task_heading,
            task_description,
        } = req.body;

        const task_id = req.params.task_id;

        const task = await Task.findById(task_id);
        if (!task) {
            return res.status(404).json('Task not found');
        }

     
        if (push_employees_id && push_employees_id.length > 0) {
            const existingEmployeeIds = task.employees.map((emp) => emp.employee_id.toString());

      
            const newEmployeeIds = push_employees_id.filter(
                (empId) => !existingEmployeeIds.includes(empId)
            );

            if (newEmployeeIds.length > 0) {
                const newEmployees = await Employee.find({ _id: { $in: newEmployeeIds } }).select('name role photo');
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
                    { _id: { $in: newEmployeeIds } },
                    { $push: { task_notdone: task._id } }
                );
            }
        }

      
        if (remove_employees_id && remove_employees_id.length > 0) {
            await Task.findByIdAndUpdate(task_id, {
                $pull: { employees: { employee_id: { $in: remove_employees_id } } },
            });

            await Employee.updateMany(
                { _id: { $in: remove_employees_id } },
                { $pull: { task_notdone: task._id } }
            );
        }

     
        if (task_date) task.task_date = new Date(task_date);
        if (from) task.from = new Date(from);
        if (to) task.to = new Date(to);
        if (task_heading) task.task_heading = task_heading;
        if (task_description) task.task_description = task_description;

        await task.save();

        res.status(200).json('Task updated successfully!');
    } catch (e) {
        console.error('Error:', e.message);
        res.status(500).json(e.message);
    }
};


const get_all_notdone_tasks = async (req, res) => {
  try {
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }

   const all_tasks = await Task.find()
   
    res.status(200).json(all_tasks);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const not_done_tasks_in_section = async (req, res) => {
  try {
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json('not Available!');
    }
    const section =req.body.section
   const all_tasks = await Task.find({section: section})
   
    res.status(200).json(all_tasks);
  } catch (e) {
    res.status(500).json(e.message);
  }
};
const done_tasks_in_section = async (req, res) => {
  try {
    let user_data;
  
  const admin=  await Admin.findById(req.user._id);
if(!admin){

  user_data = await Employee.findById(req.user._id);
}else{
  user_data = await Admin.findById(req.user._id);
}
    if (!user_data.isManager) {
      return res.status(400).json(' not Available!');
    }
    const section =req.body.section
   const all_tasks = await DoneTask.find({section: section})
   
    res.status(200).json(all_tasks);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = {
  Register,
  add_task,
  delete_Task,
  get_all_notdone_tasks,
  not_done_tasks_in_section,
  done_tasks_in_section,
  getEmployee,
  getAllEmployee,
  editAdminData,
  get_tasks_nearly_not_done,
  get_all_done_tasks,
  get_det_done_task,
  deleteEmployee,
  deleteDoneTask,
  get_employee_not_verified,
  verifyEmployeeEmail,
  remove_verifyEmployeeEmail,
  get_employees_ref_section,
  edit_employee_data,
  get_det_notdone_task,
  update_task,
  delete_all_done_taskings,
  delete_all_not_done_taskings   

}
