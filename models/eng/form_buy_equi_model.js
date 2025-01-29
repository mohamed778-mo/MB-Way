const mongoose = require('mongoose');
const validator=require('validator')
let BuyequipmentSchema = new mongoose.Schema({
    company_name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        validate(valu){
            if(!validator.isEmail(valu)){
                throw new Error("Invalid email")
            }
        }
    },
    phone:{
        type:String,
        required:true
    },
    equipment:[{
    equipment_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Equipment',
        },
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
    }
],

steps: [{
    location: String,
    step:String,
    late_reason: String,
    didnot_start: Boolean,
    in_progress: Boolean,
    complete: Boolean,
}],

});

module.exports = mongoose.model('BuyEquipment', BuyequipmentSchema);
