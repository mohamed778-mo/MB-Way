const mongoose = require('mongoose');


var chatSchema = new mongoose.Schema({
    
    content: {
        type: Array,
        default: []
    }, 
    attachment: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
});


module.exports = mongoose.model('Chat', chatSchema);
