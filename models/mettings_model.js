const mongoose = require('mongoose'); 

var meetingSchema = new mongoose.Schema({
    meeting_heading:{
        type:String,
    },
    meeting_description:{
        type:String,
    },
    section:{
        type:String,
    },
    meeting_date:{
        type:Date,
    },
    from:{
        type:Date,
    },
    to:{
        type:Date,
    },
    link:{
        type:String,
    },
   employees:[{
       employee_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Empolyee'
       },
        name:{
            type:String
        },
        role:{
            type:String
        },
        photo:{
            type:String
        }
    }]
});

module.exports = mongoose.model('Meeting', meetingSchema);
