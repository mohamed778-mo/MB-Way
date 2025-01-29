const mongoose = require('mongoose');
const validator=require('validator')
let suppliersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    personal_photo:{
        type: String, //file

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
    },
    prices_list: {  //file 
        type: String,
    },
    terms_of_dealing: { //file
        type: String,
    },
    details_would_like_to_add: {
        type: String,
    },
   



});

module.exports = mongoose.model('Suppliers', suppliersSchema);
