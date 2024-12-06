const mongoose = require('mongoose'); 

var meetingSchema = new mongoose.Schema({
    meeting_heading:{
        type:String,
    },
    meeting_description:{
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
    employees_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Empolyee'
    }]
});

module.exports = mongoose.model('Meeting', meetingSchema);