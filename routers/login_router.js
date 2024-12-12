const express = require("express")
const router = express.Router()

const{ Login }=require("../controllers/login_api")

router.post('/login',Login)

module.exports = router
