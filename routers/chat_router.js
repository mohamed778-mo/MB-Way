const express = require("express")
const router = express.Router()

const{ addMessage ,getMessages,deleteChat,markMessagesAsRead}=require("../controllers/chat")
const Istorage=require("../middleware/multer")

router.post('/add_message/:senderId/:receiverId',Istorage.any(),addMessage)
 
router.get('/get_messages/:userIdReceiver/:userIdSender',getMessages)

router.delete('/delete_chat/:senderId/:receiverId',deleteChat)

router.patch('/mark_messages_as_read/:userIdReceiver/:userIdSender',markMessagesAsRead)

module.exports = router