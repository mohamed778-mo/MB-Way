const express = require("express")
const router = express.Router()

const {auth,adminAuth}=require("../middleware/auth")

const{
    admin_add_metting,
    manager_add_metting,
    get_all_meetings,
    get_det_meeting,
    delete_meeting,
    update_meeting,
    delete_all_meeting,
    get_metting_in_section,
    //employee
    get_employee_meetings,
    get_employee_det_meeting,}=require("../controllers/meeting_cont")

router.post("/admin/create_meeting",adminAuth,admin_add_metting)
router.post("/create_meeting",auth,manager_add_metting)
router.get("/get_all_meetings",get_all_meetings)
router.get("/get_det_meeting/:meeting_id",get_det_meeting)
router.get("/get_meeting_in_section",get_metting_in_section)
router.delete("/delete_meeting/:meeting_id",delete_meeting)
router.patch("/edit_meeting/:meeting_id",update_meeting)
router.delete("/delete_all_meetings",delete_all_meeting)

//employee

router.get("/employee_meetings",get_employee_meetings)
router.get("/employee_det_meeting/:meeting_id",get_employee_det_meeting)

module.exports = router
