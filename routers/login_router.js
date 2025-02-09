const express = require("express")
const router = express.Router()

const{ Login , getProfile , remove_my_account}=require("../controllers/login_api")

const {auth}=require("../middleware/auth.js")

router.post('/login',Login)

router.get('/get_profile',auth,getProfile)

router.delete('/remove_my_account',auth,remove_my_account)



module.exports = router
