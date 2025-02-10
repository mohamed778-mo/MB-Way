const express = require("express")
const router = express.Router()

const{ addMessage ,getMessages , deleteChat , markMessagesAsRead  , get_all_users ,get_profile_by_id}=require("../controllers/chat")
const Istorage=require("../middleware/multer")
const {auth}=require("../middleware/auth")

router.post("/add_message/:senderId/:receiverId",auth,Istorage.any(),addMessage)
 
router.get("/get_messages/:userIdSender/:userIdReceiver",auth,getMessages)

router.delete("/delete_chat/:senderId/:receiverId",auth, deleteChat)

router.patch("/mark_messages_as_read/:userIdSender/:userIdReceiver",auth, markMessagesAsRead)

router.get("/get_all_users",auth,get_all_users)

router.get("/get_profile_by_id/:user_id",auth,get_profile_by_id)


module.exports = router
