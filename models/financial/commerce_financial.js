const mongoose = require('mongoose');


let CommercefinancialSchema = new mongoose.Schema({
    month: {
        type: String,
        required: true,
    },
    total_income:{
        type: Number,

    },
    expenses: {
        type: Number,
       

    },
    our_products: {
        type: Number,
    },
    general_products: {
        type: Number,
    },

    document: {   //file
        type: String,
    },
  



});

module.exports = mongoose.model('C_Financial', CommercefinancialSchema);
