const express = require("express");
const router = express.Router();
const Istorage = require("../middleware/multer");
const {  auth } = require("../middleware/auth"); 

const {
  Register,
  add_task,
  delete_Task,
  get_all_notdone_tasks,
  not_done_tasks_in_section,
  done_tasks_in_section,
  getEmployee,
  getAllEmployee,
  editAdminData,
  get_tasks_nearly_not_done,
  get_all_done_tasks,
  get_det_done_task,
  deleteEmployee,
  deleteDoneTask,
  get_employee_not_verified,
  verifyEmployeeEmail,
  remove_verifyEmployeeEmail,
  get_employees_ref_section,
  get_det_notdone_task,
  update_task,
  delete_all_done_taskings,
  delete_all_not_done_taskings   
} = require("../controllers/admin_cont");

router.post('/register', Istorage.any(), Register); //admin

router.post('/add_task', auth, Istorage.any(), add_task); //admin manager
router.patch('/edit_not_done_task/:task_id', auth, update_task); //admin manager
router.put('/not_done_tasks_in_section', auth, not_done_tasks_in_section); //admin manager
router.put('/done_tasks_in_section', auth, done_tasks_in_section); //admin manager
router.get('/get_det_done_task/:task_id', auth, get_det_done_task); //admin manager
router.get('/get_det_not_done_task/:task_id', auth, get_det_notdone_task); //admin manager
router.delete('/delete_done_task/:task_id', auth, deleteDoneTask);//admin manager
router.delete('/delete_not_done_task/:task_id',auth, delete_Task);//admin manager

router.get('/get_all_notdone_tasks', auth, get_all_notdone_tasks); //admin 
router.get('/get_tasks_nearly_not_done', auth, get_tasks_nearly_not_done); //admin 
router.get('/get_all_done_tasks', auth, get_all_done_tasks); //admin 
router.delete('/delete_all_done_taskings', auth, delete_all_done_taskings); //admin
router.delete('/delete_all_not_done_taskings', auth, delete_all_not_done_taskings); //admin




router.patch('/verify_email/:employee_id', auth,verifyEmployeeEmail); //admin 
router.patch('/remove_verify_email/:employee_id',auth, remove_verifyEmployeeEmail);//admin 
router.get('/get_employees_not_verified',auth, get_employee_not_verified);//admin 
router.get('/get_all_employee', auth, getAllEmployee);//admin 



router.get('/get_employee/:employee_id', auth, getEmployee);//admin manager
router.put('/edit_employee_data/:employee_id', auth, edit_employee_data);//admin manager
router.delete('/delete_employee/:employee_id', auth, deleteEmployee); //admin manager
router.put('/get_employees_ref_section',auth, get_employees_ref_section); //admin manager



module.exports = router;
