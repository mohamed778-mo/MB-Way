const express = require("express")
const router = express.Router()

const{
    Register,
    editEmployeeData,
    get_employee_tasks,
    get_employee_det_task,
    attach_employee_task,
     }=require("../controllers/employee_cont")
const Istorage=require("../middleware/multer")
const {auth}=require("../middleware/auth")

router.post('/register',Istorage.any(),Register)
router.put('/edit_employee_data',auth,Istorage.any(),editEmployeeData)
router.get('/get_employee_tasks',auth,get_employee_tasks)
router.get('/get_employee_det_task/:task_id',auth,get_employee_det_task)
router.post('/attach_employee_task/:task_id',auth,attach_employee_task)




module.exports = router

