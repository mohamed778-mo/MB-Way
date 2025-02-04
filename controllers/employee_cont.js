const Employee = require("../models/employee_model");
const Admin =require("../models/admin_model")

const Task =require("../models/task_model")
const DoneTask =require("../models/done_task_upload")

const mongoose = require("mongoose");
require("dotenv").config();


const Register = async (req, res) => {
  try {
    const file = req.files?.find(f => f.fieldname === 'file');
         let link ;
       
         if (file) {
            link = `http://localhost:3000/uploads/${file.filename}`;
        }else {link = null;}

      
    const user = req.body;
    const duplicatedEmail = await Employee.findOne({ email: user.email }) ||  await Admnin.findOne({ email: user.email })
    if (duplicatedEmail) {
      return res.status(400).json("Email already exist!!");
    }
    const newUser = new Employee({ ...user,photo:link});
  
    await newUser.save();

    res.status(200).json("register is success please wait verfiy !!");
  } catch (error) {
    res.status(500).json(error.message);
  }
};



const editEmployeeData = async (req, res) => {
  try {
    const id = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json("ID is not correct!!");
    }
    const data=await Employee.findById(id)
    if (!data) {
      return res.status(404).json("User not found!");
    }
    const check_block =data.isBlock;
    if (check_block) {
      return res.status(404).json("you are BLOCKED !!");
    }
    const file = req.files?.find(f => f.fieldname === 'file');
        
       
         if (file) {
          const link = `http://localhost:3000/uploads/${file.filename}`;
          
           await Employee.findByIdAndUpdate(id,{...req.body,photo:link, new: true })
          await data.save();

          return res.status(200).json("Data updated successfully!");

      }

  
    await Employee.findByIdAndUpdate(id,{...req.body, new: true })

    return res.status(200).json("Data updated successfully!");

  } catch (e) {
    res.status(500).json(e.message);
  }
};


const get_employee_tasks = async (req, res) => {
  try {
    const id = req.user._id;

    
    const employee_data = await Employee.findById(id).populate('task_notdone', 'task_heading');
    
    const check_block =employee_data.isBlock;
    if (check_block) {
      return res.status(404).json("you are BLOCKED !!");
    }
    
    if (!employee_data) {
      return res.status(404).json('Employee not found!');
    }

   
    const tasks_id = employee_data.task_notdone.map(task => task._id);
    const tasks_heading = employee_data.task_notdone.map(task => task.task_heading);

   
    res.status(200).json({ tasks_id, tasks_heading });
  } catch (e) {
    res.status(500).json(e.message);
  }
};



const get_employee_det_task= async(req,res)=>{
  try{
 const task_id = req.params.task_id
 const task_data = await Task.findById(task_id).select('-employees_id')

 if (!task_data) {
  return res.status(404).json('Task not found!');
}

 res.status(200).json(task_data)
  }catch(e){res.status(500).json(e.message)}
}


const attach_employee_task = async (req, res) => {
  try {
    // const file = req.files?.find(f => f.fieldname === 'file');
    // if (!file) return res.status(400).json('No file uploaded.');

    const link = `http://localhost:3000/uploads/TEST`;
// ${file.filename}
    
    const data_employee = await Employee.findById(req.user._id);
    if (!data_employee) return res.status(404).json('Employee not found!');
    if (data_employee.isBlock) return res.status(403).json('You are BLOCKED!');

    const task_id = req.params.task_id;
    const task_data = await Task.findById(task_id);
    if (!task_data) return res.status(404).json('Task not found!');
    if (!task_data.to || !task_data.from) return res.status(400).json('Task dates are missing or invalid.');

  
    const check_doneTask = await DoneTask.findOne({ task_id });
    if (check_doneTask) {
      const isAlreadySubmitted = check_doneTask.attachment.some(
          attachment => attachment.employee_id.toString() === req.user._id.toString()
      );
      if (isAlreadySubmitted) {
        return res.status(400).json('You have already submitted this task.');
      }
    }

    const deadline_task_date = task_data.to;
    const task_start_date = task_data.from;
    const attachment_date = new Date();

    const taskDuration = deadline_task_date.getTime() - task_start_date.getTime();
    const timeElapsed = attachment_date.getTime() - task_start_date.getTime();
    const timeDifferencePercentage = (timeElapsed / taskDuration) * 100;

    let rate = 1; 
    if (timeDifferencePercentage <= 30) rate = 5;
    else if (timeDifferencePercentage <= 50) rate = 4;
    else if (timeDifferencePercentage <= 70) rate = 3;
    else if (timeDifferencePercentage <= 80) rate = 2;

    const attachment = {
      attach_time: new Date(),
      link: link,
      employee_id: req.user._id,
      name: data_employee.name,
      rate:rate,
    };

    if (!check_doneTask) {
      const new_LinkTask = new DoneTask({
        task_heading: task_data.task_heading,
        section: task_data.section,
        from: task_data.from,
        to: task_data.to,
        task_id: task_id,
        attachment: [attachment],
      });
      await new_LinkTask.save();
    } else {
      delete attachment.rate; 
      check_doneTask.attachment.push(attachment);
      await check_doneTask.save();
    }

    data_employee.task_done.push(task_id);
    data_employee.task_notdone = data_employee.task_notdone.filter(id => id.toString() !== task_id);
    await data_employee.save();

    const updatedTask = await Task.findByIdAndUpdate(
        task_id,
        { $pull: { employees_id: req.user._id } },
        { new: true }
    );


    res.status(200).json('Attach task is successful.');
  } catch (e) {
  
    res.status(500).json(e.message);
  }
};





module.exports = {
    Register,
    editEmployeeData,
    get_employee_tasks,
    get_employee_det_task,
    attach_employee_task,
   

    
}



