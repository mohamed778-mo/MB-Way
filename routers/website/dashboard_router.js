const express = require("express")
const router = express.Router()

const{
    dash_register,
    dash_admin_Login,
    add_section,
    edit_section,
    get_all_sections,
    get_section,
    get_service,
    delete_service,
    delete_all_services,
}=require("../../controllers/website/dashboard(website)_control")
const Istorage=require("../../middleware/multer")
const {adminAuth}=require("../../middleware/auth")

router.post('/register',dash_register)
router.post('/login',dash_admin_Login)
router.put('/add_section',adminAuth,Istorage.any(),add_section)
router.put('/edit_section/section_id',adminAuth,Istorage.any(),edit_section)
router.post('/get_all_sections',adminAuth,get_all_sections)
router.get('/get_section/:section_id',adminAuth,get_section)
router.get('/get_service/:section_id/:service_id',adminAuth,get_service)
router.get('/delete_service/:section_id/:service_id',adminAuth,delete_service)
router.get('/delete_all_services',adminAuth,delete_all_services)

module.exports = router

