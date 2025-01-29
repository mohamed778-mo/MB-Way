const mongoose = require('mongoose');

let ProductsSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
    },
    choice:{
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
    type: [String], 
},
available_size: {
    type: [String], 
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
   



});

module.exports = mongoose.model('Product', ProductsSchema);
