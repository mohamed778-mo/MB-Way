const express = require("express")
const router = express.Router()

const{ Login , getProfile }=require("../controllers/login_api")

const {auth}=require("../middleware/auth.js")

router.post('/login',Login)

router.get('/get_profile',auth,getProfile)


module.exports = router
