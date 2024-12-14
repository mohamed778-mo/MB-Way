const mongoose = require('mongoose'); 

var AppointmentsSchema = new mongoose.Schema({
    client_name:{
        type:String,
    },
    client_age:{
        type:Number,
    },
    client_phone:{
        type:String,
    },
    client_email:{
        type:String,
    },
    gender:{
        type:String,
    },
    appointment_date:{
        type:Date,
    },
    from:{
        type:String,
        },
    to:{
        type:String,
        },
   section:{
    type:String,
   },
   type:{
    type:String,
   },
    file:{
        type:String,
    },
    employee_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee'
    },
    employee_name:{
        type:String,
    },
    reason_visit:{
        type:String,
    }
});

module.exports = mongoose.model('Appointments', AppointmentsSchema);
