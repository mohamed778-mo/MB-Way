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
    employees:[{
       employee_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Empolyee'
       },
        employee_name:{
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

module.exports = mongoose.model('Task', taskSchema);
