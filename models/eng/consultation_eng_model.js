const mongoose = require('mongoose');

let ConsultationSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        required: true,
    },
    company_name:{
        type: String,

    },
    email: {
        type: String,
        required: true,

    },
    phone: {
        type: String,
        required: true,

    },
    engineering_site_address: {
        type: String,
    },
    project_name: {
        type: String,
    },
    project_type: {
        type: String,
    },
    type_of_consultation_required: {
        type: String,
    },
    current_site_status: {
        type: String,
    },
    ready_project_documents: {   //file
        type: String,
    },
    engineering_drawings: {   //file
        type: String,
    },
    special_requirements_or_comments: {
        type: String,
    },
  



});

module.exports = mongoose.model('Consultation', ConsultationSchema);
