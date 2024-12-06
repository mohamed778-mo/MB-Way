const mongoose = require('mongoose'); 

var DoneTaskSchema = new mongoose.Schema({
    task_heading: {
        type: String,
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
    },
    section: {
        type: String,
    },
    from: {
        type: String,
    },
    to: {
        type: String,
    },
    attachment: [
        {
            attach_time: {
                type: Date, 
            },
            link: {
                type: String,
            },
            employee_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Employee',
            },
            employee_name: {
                type: String,
            },
        },
    ],
});

module.exports = mongoose.model('DoneTask', DoneTaskSchema);
