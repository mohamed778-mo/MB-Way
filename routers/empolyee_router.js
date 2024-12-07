const express = require("express")
const router = express.Router()

const{
    Register,
    Login,
    editEmployeeData,
    manager_add_task,
    
    get_employee_tasks,
    get_employee_det_task,
    attach_employee_task,

    get_all_done_tasks,
    get_det_done_task,
    get_all_notdone_tasks,
    get_det_notdone_task,
    deleteTask,
    deleteDoneTask,
    update_task,
    get_employees_ref_section,
    edit_in_employee_data
     }=require("../controllers/employee_cont")
const Istorage=require("../middleware/multer")
const {auth}=require("../middleware/auth")

router.post('/register',Istorage.any(),Register)

router.post('/login',Login)

router.put('/edit_employee_data',auth,Istorage.any(),editEmployeeData)

router.put('/get_employees_ref_section',auth,get_employees_ref_section)

router.post('/manager_add_task',manager_add_task)
router.get('/get_employee_tasks',auth,get_employee_tasks)
router.get('/get_employee_det_task/:task_id',auth,get_employee_det_task)
router.post('/attach_employee_task/:task_id',auth,Istorage.any(),attach_employee_task)
router.get('/get_all_done_tasks',auth,get_all_done_tasks)
router.get('/get_det_done_task/:task_id',auth,get_det_done_task)
router.get('/get_all_notdone_tasks',auth,get_all_notdone_tasks)
router.get('/get_det_notdone_task/:task_id',auth,get_det_notdone_task)
router.put('/update_task/:task_id',auth,update_task)

router.delete('/delete_task/:task_id',auth,deleteTask)
router.delete('/delete_done_task/:task_id',auth,deleteDoneTask)

router.patch('/edit_in_employee_data/:employee_id',edit_in_employee_data)


module.exports = router

