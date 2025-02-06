const mongoose = require('mongoose');
const validator=require('validator')
let suppliersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    personal_photo:{
        type: String, //file,
        default:null

    },
    email: {
        type: String,
        trim:true,
        validate(valu){
            if(!validator.isEmail(valu)){
                throw new Error("Invalid email")
            }
        }
    },
    phone: {
        type: String,

    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    products_type: {
        type: String,
    },
    export_type: {
        type: String,
    },
    certificates: {  //file
        type: String,
        default:null
    },
    prices_list: {  //file 
        type: String,
        default:null
    },
    terms_of_dealing: { //file
        type: String,
        default:null
    },
    details_would_like_to_add: {
        type: String,
    },
   



});

module.exports = mongoose.model('Suppliers', suppliersSchema);
