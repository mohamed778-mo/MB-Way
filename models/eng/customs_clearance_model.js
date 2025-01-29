const mongoose = require('mongoose');
const validator=require('validator')
let CustomsClearanceSchema = new mongoose.Schema({
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
    bill_of_lading_number: {
        type: String,
    },
    consignment_products: {
        type: String,
    },
    quantity_of_products: {
        type: Number,
    },
    country_of_origin: {
        type: String,
    },
    arrival_port: {
        type: String,
    },
    shipment_type: {
        type: String,
    },
    date_of_shipment_arrival: {
        type: String,
    },
    expected_financial_cost: {
        type: String,
    },
    expected_date_of_delivery:{
        type: String,
    },
    recent_photos_of_the_site:{  //file
        type: String,
    },

    bill_of_lading: {   //file
        type: String,
    },
    purchase_invoice: {  //file
        type: String,
    },
    certificate_of_origin: {  //file
        type: String,
    },
    packing_list:{     //file
        type: String,
    },
    import_permit:{  //file
        type: String,
    } ,
    technical_specifications_certificates: {  //file
        type: String,
    },
    equipment_data: {   //file
        type: String,
    },
    acknowledgment_and_pledge: {    //file
        type: String,
    },
    details_you_would_like_to_add: {
        type: String,
    },
  
    
    



});

module.exports = mongoose.model('Customs', CustomsClearanceSchema);
