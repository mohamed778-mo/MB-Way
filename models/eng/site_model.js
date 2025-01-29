const mongoose = require('mongoose');
const validator=require('validator')
let SiteEngSchema = new mongoose.Schema({
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
        trim:true,
        validate(valu){
            if(!validator.isEmail(valu)){
                throw new Error("Invalid email")
            }
        }

    },
    phone: {
        type: String,
        required: true,

    },
    project_name: {
        type: String,
    },
    on_site_staff: {
        type: String,
    },
    number_of_employees_required: {
        type: Number,
    },
    participating_companies_or_contractors: {
        type: String,
    },
    company_address: {
        type: String,
    },
    required_works: {
        type: String,
    },
    project_type: {
        type: String,
    },
    expected_financial_cost: {
        type: String,
    },
    project_start_date:{
        type: String,
    },
    project_end_date:{
        type: String,
    },

    special_instructions_or_additional_requests: {
        type: String,
    },
    current_problems_on_the_site: {
        type: String,
    },
    contract_type: {
        type: String,
    },
    recent_photos_of_the_site:{ //file
        type: String,
    },
    technical_reports:{  //file
        type: String,
    } ,
    contract_agreements_with_suppliers: {  //file
        type: String,
    },
    contract_duration: {
        type: String,
    },
    project_space: {
        type: String,
    },
  
    
    



});

module.exports = mongoose.model('Site', SiteEngSchema);
