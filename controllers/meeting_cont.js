const Employee = require("../models/employee_model");
const Admin = require("../models/admin_model");
const Meeting = require("../models/mettings_model");

require("dotenv").config();


const admin_add_metting = async (req, res) => {
  try {
     
      const user_data = await Admin.findById(req.user._id);
      
      if (!user_data) {
          return res.status(400).send('Admin not exist !!');
      }

      const { 
          meeting_heading, 
          meeting_description, 
          meeting_date, 
          from, 
          to, 
          link,
          employees_id 
      } = req.body;

     
      const new_meeting = new Meeting({
          meeting_heading,
          meeting_description,
          meeting_date,
          from,
          to,
          link,
          employees_id,
      });
      await new_meeting.save();

      
      await Employee.updateMany(
          { _id: { $in: employees_id } }, 
          { $push: { meeting: new_meeting._id } } 
      );

      res.status(200).send('MEETING created successfully!');
  } catch (e) {
      res.status(500).send(e.message);
  }
};

const manager_add_metting = async (req, res) => {
    try {
       
        const user_data = await Employee.findById(req.user._id);
        const check_block =user_data.isBlock;
        if (check_block) {
           return res.status(404).send("you are BLOCKED !!");
        }
        if (!user_data.isManager) {
            return res.status(400).send('You are not a manager!');
        }
  
        const { 
            meeting_heading, 
            meeting_description, 
            meeting_date, 
            from, 
            to, 
            link,
            employees_id 
        } = req.body;
  
       
        const new_meeting = new Meeting({
            meeting_heading,
            meeting_description,
            meeting_date,
            from,
            to,
            link,
            employees_id,
        });
        await new_meeting.save();
  
        
        await Employee.updateMany(
            { _id: { $in: employees_id } }, 
            { $push: { meeting: new_meeting._id } } 
        );
  
        res.status(200).send('METTING created successfully!');
    } catch (e) {
        res.status(500).send(e.message);
    }
  };


  const get_employee_meetings = async (req, res) => {
    try {
      const id = req.user._id;
  
      
      const employee_data = await Employee.findById(id).populate('meeting', 'meeting_heading');
      
      const check_block =employee_data.isBlock;
      if (check_block) {
        return res.status(404).send("you are BLOCKED !!");
      }
      
      if (!employee_data) {
        return res.status(404).send('Employee not found!');
      }
  
     
      const meetings_id = employee_data.meeting.map(meet => meet._id);
      const meetings_heading = employee_data.meeting.map(meet => meet.meeting_heading);
  
     
      res.status(200).send({ meetings_id, meetings_heading });
    } catch (e) {
      res.status(500).send(e.message);
    }
  };
  
  
  
  const get_employee_det_meeting= async(req,res)=>{
    try{
   const meeting_id = req.params.meeting_id
   const meeting_data = await Meeting.findById(meeting_id).select('-employees_id')
  
   if (!meeting_data) {
    return res.status(404).send('meeting not found!');
  }
  
   res.status(200).send(meeting_data)
    }catch(e){res.status(500).send(e.message)}
  }

  const get_all_meetings = async (req, res) => {
    try {
     
      const  meetings_data = await  Meeting.find()
     
      res.status(200).send(meetings_data);
    } catch (e) {
      res.status(500).send(e.message);
    }
  };
  
  
  
  const get_det_meeting= async(req,res)=>{
    try{
   const meeting_id = req.params.meeting_id
   const meeting_data = await Meeting.findById(meeting_id)
  
   if (!meeting_data) {
    return res.status(404).send('meeting not found!');
  }
  
   res.status(200).send(meeting_data)
    }catch(e){res.status(500).send(e.message)}
  }

  const delete_meeting= async(req,res)=>{
    try{
   const meeting_id = req.params.meeting_id
   await Meeting.findByIdAndDelete(meeting_id)
   res.status(200).send('Meeting deleted successfully!')
    }catch(e){res.status(500).send(e.message)}
  }
  const update_meeting = async (req, res) => {
    try {
      const { 
        push_employees_id, 
        remove_employees_id, 
        meeting_date, 
        from, 
        to, 
        link, 
        meeting_heading, 
        meeting_description 
      } = req.body;
  
      const meeting_id = req.params.meeting_id;
  
      const meeting = await Meeting.findById(meeting_id);
      if (!meeting) {
        return res.status(404).send('Meeting not found');
      }
  
      // التحقق من التكرار قبل الإضافة
      if (push_employees_id) {
        const existingEmployees = meeting.employees_id.filter((id) => 
          push_employees_id.includes(id.toString())
        );
  
        if (existingEmployees.length > 0) {
          return res
            .status(400)
            .send(`Employee(s) with ID(s) ${existingEmployees.join(', ')} are already assigned to this meeting.`);
        }
  
        // إضافة الموظفين الجدد
        await Meeting.findByIdAndUpdate(meeting_id, {
          $addToSet: { employees_id: { $each: push_employees_id } },
        });
  
        // تحديث بيانات الموظفين
        await Employee.updateMany(
          { _id: { $in: push_employees_id } },
          { $push: { meeting: meeting._id } }
        );
      }
  
      // إزالة الموظفين
      if (remove_employees_id) {
        await Meeting.findByIdAndUpdate(meeting_id, {
          $pull: { employees_id: { $in: remove_employees_id } },
        });
  
        await Employee.updateMany(
          { _id: { $in: remove_employees_id } },
          { $pull: { meeting: meeting._id } }
        );
      }
  
      // تحديث باقي الحقول
      if (meeting_date) meeting.meeting_date = meeting_date;
      if (from) meeting.from = from;
      if (to) meeting.to = to;
      if (link) meeting.link = link;
      if (meeting_heading) meeting.meeting_heading = meeting_heading;
      if (meeting_description) meeting.meeting_description = meeting_description;
  
      await meeting.save();
  
      res.status(200).send('Meeting updated successfully!');
    } catch (e) {
      console.error('Error:', e.message);
      res.status(500).send(e.message);
    }
  };
  
  
  
  const delete_all_meeting= async(req,res)=>{
    try{
   await Meeting.deleteMany()
   res.status(200).send('All meetings deleted successfully!')
    }catch(e){res.status(500).send(e.message)}
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