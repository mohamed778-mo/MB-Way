const mongoose = require('mongoose');
const validator=require('validator')
let RequestsSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    email:{
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
    products:[{
        product_id: {
            type: String,
        },
        product_name: {
            type: String,
        },
        image:{
            type: String,
    
        },
        quantity: {
            type: Number,
    
    
        },
        price: {
            type: String,
    
        },
        products_type: {
            type: String,
        },
        available_colors: {
            type: String,
        },
        available_size: {
            type: String,
        },
        barcode: {
            type: String,
        },
        warranty: {
            type: String,
        },
        additional_features: { 
            type: String,
        },
    }]
   
   



});

module.exports = mongoose.model('Request', RequestsSchema);
