const express = require("express")
const router = express.Router()

const Istorage=require("../middleware/multer")

const{
    add_medical_form,
    get_forms_available,
    get_medical_forms,
    get_form_medical_by_id,
    update_medical_form,
    delete_medical_form,
    delete_medical_all_forms,
    get_my_forms_medical_by_employee_id
}=require("../controllers/form_cont")

router.post("/add_form",Istorage.any(),add_medical_form)
router.get("/get_forms_available",get_forms_available)
router.get("/get_forms",get_medical_forms)
router.get("/get_form/:form_id",get_form_medical_by_id)
router.put("/update_form/:form_id",update_medical_form)
router.delete("/delete_form/:form_id",delete_medical_form)
router.delete("/delete_all_forms",delete_medical_all_forms)
router.get("/get_my_forms/:employee_id",get_my_forms_medical_by_employee_id)


module.exports = router
