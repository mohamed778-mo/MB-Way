const mongoose = require('mongoose');

let BuyequipmentSchema = new mongoose.Schema({
    company_name:{
        type:String,
    },
    email:{
        type:String,
        required:true
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
    }
],

steps: [{
    location: String,
    late_reason: String,
    didnot_start: Boolean,
    in_progress: Boolean,
    complete: Boolean,
}],

});

module.exports = mongoose.model('BuyEquipment', BuyequipmentSchema);
