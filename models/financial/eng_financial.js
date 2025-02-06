const mongoose = require('mongoose');


let EngfinancialSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    total_income:{
        type: Number,

    },
    revenues: {
        type: Number,

    },
    expenses: {
        type: Number,
       

    },
    revenues_technical_service: {
        type: Number,
    },
    expenses_technical_service: {
        type: Number,
    },
    consulting_and_recruitment: {
        type: Number,
    },
    engineering_equipment: {   
        type: Number,
    },
    engineering_projects: {   
        type: Number,
    },
    document: {   //file
        type: String,
    },
  



});

module.exports = mongoose.model('E_Financial', EngfinancialSchema);
