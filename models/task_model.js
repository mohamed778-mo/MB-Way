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
        type:Date,
    },
    to:{
        type:Date
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

module.exports = mongoose.model('Task', taskSchema);
