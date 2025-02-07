const mongoose = require('mongoose');

let ProductsSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true,
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
    brand:{
        type: String,
    }
   



});

module.exports = mongoose.model('Product', ProductsSchema);
