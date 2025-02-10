const mongoose = require('mongoose');


var chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel', 
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel', 
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['Employee', 'Admin'], 
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['Employee', 'Admin'], 
    },
     content: [{
    message: String,
    timestamp: { type: Date, default: Date.now },
    isRead: { type: Boolean, default: false },
    attachment: String,
    sender: String,
    me: Boolean 
  }],
    timestamp: {
        type: Date,
        default: Date.now,
    },
 
});


module.exports = mongoose.model('Chat', chatSchema);
