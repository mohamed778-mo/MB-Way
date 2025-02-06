const mongoose = require('mongoose');


let MedicalfinancialSchema = new mongoose.Schema({
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
    therapeutic_services: {
        type: Number,
    },
    visiting_services: {
        type: Number,
    },
    cosmetic: {
        type: Number,
    },
    slimming: {
        type: Number,
    },
    eye_surgery: {
        type: Number,
    },
    oncology: {   
        type: Number,
    },
    orthopedic: {   
        type: Number,
    },
    dental: {
        type: Number,
    },
    physical_therapy: {
        type: Number,
    },
    document: {   //file
        type: String,
    },
  



});

module.exports = mongoose.model('M_Financial', MedicalfinancialSchema);
