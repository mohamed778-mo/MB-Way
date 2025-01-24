const mongoose = require('mongoose');

let EmployEngSchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
    },
    name_of_esponsible_person: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,

    },
    phone: {
        type: String,
        required: true,

    },
    company_address: {
        type: String,
    },
    job_title: {
        type: String,
    },
    number_of_employees_required: {
        type: Number,
    },
    contract_duration: {
        type: String,
    },
    contract_type: {
        type: String,
    },
    expected_Salary: {
        type: String,
    },
    start_date: {
        type: String,
    },
    job_description: {
        type: String,
    },
    required_experiences:{
        type: String,
    },
    additional_notes:{
        type: String,
    }



});

module.exports = mongoose.model('EmployEng', EmployEngSchema);
