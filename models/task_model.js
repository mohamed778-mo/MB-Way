const mongoose = require('mongoose'); 

var taskSchema = new mongoose.Schema({
    task_heading:{
        type:String,
    },
    section:{
        type:String,
    },
    task_description:{
        type:String,
    },
    from:{
        type:String,
    },
    to:{
        type:String
    },
    employees_id:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Empolyee'
    }]
});

module.exports = mongoose.model('Task', taskSchema);