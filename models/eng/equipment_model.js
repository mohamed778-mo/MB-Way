const mongoose = require('mongoose');

let EquipmentSchema = new mongoose.Schema({
    equipment_name: {
        type: String,
        required: true,
    },
    equipment_type: {
        type: String,
    },
    image: {
        type: String,
    },
    model: {
        type: String,
    },
    serial_number: {
       type: String,
        unique: true,
        required: true
    },
    brand: {
        type: String,
    },
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    price: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    warranty_duration: {
        type: String,
    },
    condition_equipment: {
        type: String,
    },
    which_is_covered_by_the_warranty:{
        type: String,
    },
    the_party_responsible_for_the_guarantee:{
        type: String,
    }



});

module.exports = mongoose.model('Equipment', EquipmentSchema);
