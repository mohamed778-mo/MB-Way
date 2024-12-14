const Appointments =require("../models/form_medical_model")
const Employee =require("../models/employee_model")


const add_medical_form = async (req, res) => {
    try {
        const file = req.files?.find(f => f.fieldname === 'file');
        let link;
        
        if (file) {
            link = `http://localhost:3000/uploads/${file.filename}`;
        } else {
            link = null;
        }

        const {
            client_name,
            client_age,
            client_phone,
            client_email,
            gender,
            reason_visit,
            date,
            from,
            to,
            employee_id,
            section,
            type
        } = req.body;

        const employee = await Employee.findById(employee_id);
        if (!employee) {
            return res.status(404).json("Doctor not found");
        }

       
        const shiftStart = new Date(`${date}T${employee.from}:00`);
        const shiftEnd = new Date(`${date}T${employee.to}:00`);
        
      
        const appointmentFrom = new Date(`${date}T${from}:00`);
        const appointmentTo = new Date(`${date}T${to}:00`);

       
        if (appointmentFrom < shiftStart || appointmentTo > shiftEnd) {
            return res.status(400).json("Appointment time must be within the employee's shift.");
        }

       
        const overlappingAppointment = await Appointments.findOne({
            employee_id: employee_id,
            appointment_date: date,
            $or: [
                { from: { $lt: appointmentTo, $gte: appointmentFrom } },
                { to: { $gt: appointmentFrom, $lte: appointmentTo } },
                { from: { $lte: appointmentFrom }, to: { $gte: appointmentTo } }
            ]
        });

        if (overlappingAppointment) {
            return res.status(400).json("There is already an appointment during this time.");
        }

        const new_form = new Appointments({
            client_name,
            client_age,
            client_phone,
            appointment_date: date,
            from,
            to,
            employee_id,
            employee_name: employee.name,
            file: link,
            client_email,
            gender,
            reason_visit,
            section,
            type
        });

        await new_form.save();
        res.status(200).json("Form is added");
    } catch (e) {
        res.status(500).json(e.message);
    }
};



const get_forms_available = async (req, res) => {
    try {
        const requestedDate = req.body.date;

        if (!requestedDate) {
            return res.status(400).json("Please provide a date.");
        }

        const startOfDay = new Date(requestedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(requestedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const forms = await Appointments.find({
            appointment_date: { $gte: startOfDay, $lte: endOfDay }
        }).populate('employee_id');

        const availableForms = forms.filter(form => {
            const employee = form.employee_id;

            if (!employee || !employee.shift || !employee.shift.from || !employee.shift.to) {
                return false;
            }

            const shiftStart = new Date(`${requestedDate}T${employee.shift.from}:00`);
            const shiftEnd = new Date(`${requestedDate}T${employee.shift.to}:00`);
            const formStart = new Date(`${requestedDate}T${form.from}:00`);
            const formEnd = new Date(`${requestedDate}T${form.to}:00`);

            return (
                formStart >= shiftStart &&
                formEnd <= shiftEnd &&
                formStart >= startOfDay &&
                formEnd <= endOfDay
            );
        });

    
        const availableDates = availableForms.map(form => {
            const from = form.from.split(':').join(':');
            const to = form.to.split(':').join(':');
            return `${from} - ${to}`;
        });

        res.status(200).json(availableDates);

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};





const get_medical_forms=async(req,res)=>{
    try{
        const forms = await Appointments.find()
        res.status(200).json(forms)
    }catch(e){
        res.status(500).json(e.message)
    }    
}

const get_form_medical_by_id=async(req,res)=>{
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

const get_my_forms_medical_by_employee_id=async(req,res)=>{
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

const update_medical_form=async(req,res)=>{
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

const delete_medical_form=async(req,res)=>{
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
const delete_medical_all_forms=async(req,res)=>{
    try{
        await Appointments.deleteMany()
        res.status(200).json("all forms deleted")
    }catch(e){
        res.status(500).json(e.message)
    }
}

module.exports={
    add_medical_form,
    get_forms_available,
    get_medical_forms,
    get_form_medical_by_id,
    update_medical_form,
    delete_medical_form,
    delete_medical_all_forms,
    get_my_forms_medical_by_employee_id
}
