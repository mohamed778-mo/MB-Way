const Employee = require("../models/employee_model");
const Admin = require("../models/admin_model");
const Meeting = require("../models/mettings_model");

require("dotenv").config();


const admin_add_metting = async (req, res) => {
  try {
    const user_data = await Admin.findById(req.user._id);
    if (!user_data) {
      return res.status(400).json('Admin does not exist!');
    }

    const {
      meeting_heading,
      meeting_description,
      meeting_date,
      from,
      to,
      link,
      employees_id, 
    } = req.body;


    const employees = await Employee.find({ _id: { $in: employees_id } }).select(
      'name role photo'
    );


    if (employees.length !== employees_id.length) {
      return res.status(400).json('Some employees do not exist!');
    }


    const new_meeting = new Meeting({
      meeting_heading,
      meeting_description,
      meeting_date,
      from,
      to,
      link,
      employees: employees.map((emp) => ({
        employee_id: emp._id,
        name: emp.name,
        role: emp.role,
        photo: emp.photo,
      })),
    });

    await new_meeting.save();

    await Employee.updateMany(
      { _id: { $in: employees_id } },
      { $push: { meetings: new_meeting._id } }
    );

    res.status(200).json('Meeting created successfully!');
  } catch (e) {
    res.status(500).json(e.message);
  }
};

const manager_add_metting = async (req, res) => {
  try {
    const user_data = await Employee.findById(req.user._id);
    if (!user_data || user_data.isBlock) {
      return res.status(404).json('You are blocked!');
    }
    if (!user_data.isManager) {
      return res.status(400).json('You are not authorized as a manager!');
    }

    const {
      meeting_heading,
      meeting_description,
      meeting_date,
      from,
      to,
      link,
      employees_id, 
    } = req.body;

 
    const employees = await Employee.find({ _id: { $in: employees_id } }).select(
      'name role photo'
    );

  
    if (employees.length !== employees_id.length) {
      return res.status(400).json('Some employees do not exist!');
    }

    const new_meeting = new Meeting({
      meeting_heading,
      meeting_description,
      meeting_date,
      from,
      to,
      link,
      employees: employees.map((emp) => ({
        employee_id: emp._id,
        name: emp.name,
        role: emp.role,
        photo: emp.photo,
      })),
    });

    await new_meeting.save();

 
    await Employee.updateMany(
      { _id: { $in: employees_id } },
      { $push: { meetings: new_meeting._id } }
    );

    res.status(200).json('Meeting created successfully!');
  } catch (e) {
    res.status(500).json(e.message);
  }
};




  const get_employee_meetings = async (req, res) => {
    try {
      const id = req.user._id;
  
      
      const employee_data = await Employee.findById(id).populate('meeting', 'meeting_heading');
      
      const check_block =employee_data.isBlock;
      if (check_block) {
        return res.status(404).json("you are BLOCKED !!");
      }
      
      if (!employee_data) {
        return res.status(404).json('Employee not found!');
      }
  
     
      const meetings_id = employee_data.meeting.map(meet => meet._id);
      const meetings_heading = employee_data.meeting.map(meet => meet.meeting_heading);
  
     
      res.status(200).json({ meetings_id, meetings_heading });
    } catch (e) {
      res.status(500).json(e.message);
    }
  };
  
  
  
  const get_employee_det_meeting= async(req,res)=>{
    try{
   const meeting_id = req.params.meeting_id
   const meeting_data = await Meeting.findById(meeting_id).select('-employees_id')
  
   if (!meeting_data) {
    return res.status(404).json('meeting not found!');
  }
  
   res.status(200).json(meeting_data)
    }catch(e){res.status(500).json(e.message)}
  }

  const get_all_meetings = async (req, res) => {
    try {
     
      const  meetings_data = await  Meeting.find()
     
      res.status(200).json(meetings_data);
    } catch (e) {
      res.status(500).json(e.message);
    }
  };
  
  
  
  const get_det_meeting= async(req,res)=>{
    try{
   const meeting_id = req.params.meeting_id
   const meeting_data = await Meeting.findById(meeting_id)
  
   if (!meeting_data) {
    return res.status(404).json('meeting not found!');
  }
  
   res.status(200).json(meeting_data)
    }catch(e){res.status(500).json(e.message)}
  }

  const delete_meeting= async(req,res)=>{
    try{
   const meeting_id = req.params.meeting_id
   await Meeting.findByIdAndDelete(meeting_id)
   res.status(200).json('Meeting deleted successfully!')
    }catch(e){res.status(500).json(e.message)}
  }


const update_meeting = async (req, res) => {
  try {
    const {
      push_employees, 
      remove_employees, 
      meeting_date,
      from,
      to,
      link,
      meeting_heading,
      meeting_description,
    } = req.body;

    const meeting_id = req.params.meeting_id;


    const meeting = await Meeting.findById(meeting_id);
    if (!meeting) {
      return res.status(404).json('Meeting not found');
    }


    if (push_employees && push_employees.length > 0) {
     
      const existingEmployeeIds = meeting.employees.map((emp) =>
        emp.employee_id.toString()
      );

 
      const newEmployeeIds = push_employees.filter(
        (empId) => !existingEmployeeIds.includes(empId)
      );

     
      const newEmployees = await Employee.find({ _id: { $in: newEmployeeIds } }).select(
        'name role photo'
      );

     
      meeting.employees.push(
        ...newEmployees.map((emp) => ({
          employee_id: emp._id,
          name: emp.name,
          role: emp.role,
          photo: emp.photo,
        }))
      );

   
      await Employee.updateMany(
        { _id: { $in: newEmployeeIds } },
        { $push: { meetings: meeting._id } }
      );
    }

 
    if (remove_employees && remove_employees.length > 0) {
     
      meeting.employees = meeting.employees.filter(
        (emp) => !remove_employees.includes(emp.employee_id.toString())
      );

      
      await Employee.updateMany(
        { _id: { $in: remove_employees } },
        { $pull: { meetings: meeting._id } }
      );
    }

 
    if (meeting_date) meeting.meeting_date = meeting_date;
    if (from) meeting.from = from;
    if (to) meeting.to = to;
    if (link) meeting.link = link;
    if (meeting_heading) meeting.meeting_heading = meeting_heading;
    if (meeting_description) meeting.meeting_description = meeting_description;

    
    await meeting.save();

    res.status(200).json('Meeting updated successfully!');
  } catch (e) {
    res.status(500).json(e.message);
  }
};

  
  const delete_all_meeting= async(req,res)=>{
    try{
   await Meeting.deleteMany()
   res.status(200).json('All meetings deleted successfully!')
    }catch(e){res.status(500).json(e.message)}
  }

  module.exports = {
    //admin
    admin_add_metting,
    //manager
    manager_add_metting,
    get_all_meetings,
    get_det_meeting,
    delete_meeting,
    update_meeting,
    delete_all_meeting,
    //employee
    get_employee_meetings,
    get_employee_det_meeting,
    

  };
