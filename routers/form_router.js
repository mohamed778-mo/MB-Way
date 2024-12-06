const express = require("express")
const router = express.Router()

const Istorage=require("../middleware/multer")

const{
    add_form,
    get_forms,
    get_form_by_id,
    update_form,
    delete_form,
    delete_all_forms,
    get_my_forms_by_employee_id
}=require("../controllers/form_cont")

router.post("/add_form",Istorage.any(),add_form)

router.get("/get_forms",get_forms)

router.get("/get_form/:form_id",get_form_by_id)

router.put("/update_form/:form_id",update_form)

router.delete("/delete_form/:form_id",delete_form)

router.delete("/delete_all_forms",delete_all_forms)

router.get("/get_my_forms/:employee_id",get_my_forms_by_employee_id)


module.exports = router