const express = require("express")
const router = express.Router()

const{ Login , getProfile , remove_my_account , editUserData }=require("../controllers/login_api")
const Istorage=require("../middleware/multer")
const {auth}=require("../middleware/auth.js")

router.post('/login',Login)

router.get('/get_profile',auth,getProfile)

router.delete('/remove_my_account',auth,remove_my_account)

router.put('/edit_user_data', auth, Istorage.any(), editUserData); 
// admin and employee edit on personal data



module.exports = router
