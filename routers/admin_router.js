const express = require("express")
const router = express.Router()
const Istorage =require("../middleware/multer")

const {adminAuth}=require("../middleware/auth")

const{
    Register, 
    Login,
    getEmployee,
    getAllEmployee,
    editAdminData,
    get_tasks_nearly_not_done,
    get_all_done_tasks,
    get_det_done_task,
    add_access_manager,
    remove_access_manager,
    deleteEmployee,
    deleteDoneTask,
    add_block,
    remove_block,
    delete_all_taskings,
    get_employee_not_verified,
    verifyEmployeeEmail,
   remove_verifyEmployeeEmail,
   get_employees_ref_section,
   edit_in_employee_data,
     delete_nearly_Task,
  get_det_notdone_task,
  update_task

}=require("../controllers/admin_cont")

router.post('/register',Istorage.any(),Register)

router.post('/login',Login)

router.get('/get_employee_not_verified',get_employee_not_verified)

router.patch('/verify_email/:employee_id',verifyEmployeeEmail)

router.patch('/remove_verify_email/:employee_id',remove_verifyEmployeeEmail)

router.get('/get_employee/:employee_id',adminAuth,getEmployee)

router.get('/get_all_employee',adminAuth,getAllEmployee)

router.put('/edit_admin_data',adminAuth,Istorage.any(),editAdminData)

router.get('/get_tasks_nearly_not_done',adminAuth,get_tasks_nearly_not_done)

router.get('/get_all_done_tasks',adminAuth,get_all_done_tasks)

router.get('/get_det_done_task/:task_id',adminAuth,get_det_done_task)

router.patch('/add_access_manager/:employee_id',adminAuth,add_access_manager)

router.patch('/remove_access_manager/:employee_id',adminAuth,remove_access_manager)

router.delete('/delete_employee/:employee_id',adminAuth,deleteEmployee)

router.delete('/delete_done_task/:task_id',adminAuth,deleteDoneTask)

router.patch('/add_block/:employee_id',adminAuth,add_block)

router.patch('/remove_block/:employee_id',adminAuth,remove_block)

router.delete('/delete_all_taskings',adminAuth,delete_all_taskings)

router.put('/get_employees_ref_section',get_employees_ref_section)

router.patch('/edit_in_employee_data/:employee_id',edit_in_employee_data)

router.get('/get_det_not_done_task/:task_id',get_det_notdone_task)

router.patch('/edit_not_done_task/:task_id',update_task)

router.delete('/delete_not_done_task/:task_id',delete_nearly_Task)



module.exports = router
