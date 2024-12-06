const Appointments =require("../models/form_model")
const Employee =require("../models/employee_model")


const add_form=async(req,res)=>{
    try{
        const file = req.files?.find(f => f.fieldname === 'file');
         let link ;
       
         if (file) {
            link = `http://localhost:3000/uploads/${file.filename}`;
        }else {link = null;}
        const {
            client_name,
            client_age,
            client_phone,
            date,
            from,
            to,
            employee_id
        }=req.body

        const employee = await Employee.findById(employee_id)
        if(!employee){
            return res.status(404).json("doctor not found")
        }
        const overlappingAppointment = await Appointments.findOne({
            employee_id: employee_id,
            appointment_date: date,
            $or: [
                { from: { $lt: to, $gte: from } }, 
                { to: { $gt: from, $lte: to } },  
                { from: { $lte: from }, to: { $gte: to } } 
            ]
        });

        if (overlappingAppointment) {
            return res.status(400).json("There is already an appointment during this time.");
        }
        const new_form = new Appointments({
            client_name,
            client_age,
            client_phone,
            appointment_date:date,
            from,
            to,
            employee_id,
            employee_name:employee.name,
            file:link,
        })
        new_form.save()
        res.status(200).json("form is added")
    }catch(e){
        res.status(500).json(e.message)
    }
}

const get_forms=async(req,res)=>{
    try{
        const forms = await Appointments.find()
        res.status(200).json(forms)
    }catch(e){
        res.status(500).json(e.message)
    }    
}

const get_form_by_id=async(req,res)=>{
    try{
        const form_id = req.params.form_id
        const form = await Appointments.findById(form_id)
        if(!form){
            return res.status(404).json("form not found")
        }
        res.status(200).json(form)
    }catch(e){
        res.status(500).json(e.message)
    }    
}

const get_my_forms_by_employee_id=async(req,res)=>{
    try{
        const employee_id = req.params.employee_id
        const forms = await Appointments.find({employee_id: employee_id})
        if(!forms){
            return res.status(404).json("forms not found")
        }
        res.status(200).json(forms)
    }catch(e){
        res.status(500).json(e.message)
    }    
}

const update_form=async(req,res)=>{
    try{
        const form_id = req.params.form_id
        const data =req.body
        let employee_name
        if(data.employee_id){
            const employee = await Employee.findById(data.employee_id)
            if(!employee){
                return res.status(404).json("doctor not found")
            }
            employee_name=employee.name
        }
        const form = await Appointments.findByIdAndUpdate(form_id,{...data,employee_name:employee_name,new:true})
        if(!form){
            return res.status(404).json("form not found")
        }
        
        await form.save()
        res.status(200).json("form is updated")
    }catch(e){
        res.status(500).json(e.message)
    }
}

const delete_form=async(req,res)=>{
    try{
        const form_id = req.params.form_id
        const form = await Appointments.findByIdAndDelete(form_id)
        if(!form){
            return res.status(404).json("form not found")
        }
        res.status(200).json("form is deleted")
    }catch(e){
        res.status(500).json(e.message)
    }
}
const delete_all_forms=async(req,res)=>{
    try{
        await Appointments.deleteMany()
        res.status(200).json("all forms deleted")
    }catch(e){
        res.status(500).json(e.message)
    }
}

module.exports={
    add_form,
    get_forms,
    get_form_by_id,
    update_form,
    delete_form,
    delete_all_forms,
    get_my_forms_by_employee_id
}
