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
    appointment_date:{
        type:Date,
    },
    from:{
        type:Date,
    },
    to:{
        type:Date,
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
    }
});

module.exports = mongoose.model('Appointments', AppointmentsSchema);