const express = require("express")

const  router = express.Router();

const Iupload = require("../middleware/multer")
const {auth} = require("../middleware/auth");


const {
    createConsultation,
    getAllConsultations,
    getConsultationById,
    updateConsultation,
    deleteConsultation,

    createCustoms,
    getAllCustoms,
    getCustomsById,
    updateCustoms,
    deleteCustoms,

    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment,

    createBuyEquipment,
    getAllBuyEquipment,
    getBuyEquipmentById,
    updateBuyEquipment,
    deleteBuyEquipment,

    createEmployEng,
    getAllEmployEng,
    getEmployEngById,
    updateEmployEng,
    deleteEmployEng,

    createSiteEng,
    getAllSiteEng,
    getSiteEngById,
    updateSiteEng,
    deleteSiteEng,

    updateSteps ,
deleteStepsForEquipment }=require("../controllers/form_eng_cont")

    router.post('/create_consultation',Iupload.any(), createConsultation)
    router.get('/get_all_consultations',auth, getAllConsultations)
    router.get('/get_consultation/:id',auth, getConsultationById)
    router.put('/update_consultation/:id',auth,Iupload.any(), updateConsultation)
    router.delete('/delete_consultation/:id',auth, deleteConsultation)

    router.post('/create_customs',Iupload.any(), createCustoms)
    router.get('/get_all_customs',auth, getAllCustoms)
    router.get('/get_customs/:id', auth,getCustomsById)
    router.put('/update_customs/:id', auth,Iupload.any(),updateCustoms)
    router.delete('/delete_customs/:id',auth, deleteCustoms)

    router.post('/create_equipment',auth, Iupload.any(), createEquipment)
    router.get('/get_all_equipment',auth, getAllEquipment)
    router.get('/get_equipment/:id',auth, getEquipmentById)
    router.put('/update_equipment/:id',auth,Iupload.any(), updateEquipment)
    router.delete('/delete_equipment/:id', auth, deleteEquipment)

    router.post('/create_buy_equipment', Iupload.any(),createBuyEquipment)
    router.get('/get_all_buy_equipment',auth, getAllBuyEquipment)
    router.get('/get_buy_equipment/:id', auth,getBuyEquipmentById)
    router.put('/update_buy_equipment/:id',auth,Iupload.any(), updateBuyEquipment)
    router.delete('/delete_buy_equipment/:id',auth, deleteBuyEquipment)
    
    router.post('/create_employ_eng',Iupload.any(), createEmployEng)
    router.get('/get_all_employ_eng',auth, getAllEmployEng) 
    router.get('/get_employ_eng/:id',auth, getEmployEngById)
    router.put('/update_employ_eng/:id', auth,Iupload.any(), updateEmployEng)
    router.delete('/delete_employ_eng/:id',auth, deleteEmployEng)
    
    router.post('/create_site_eng', Iupload.any(),createSiteEng)
    router.get('/get_all_site_eng',auth, getAllSiteEng)
    router.get('/get_site_eng/:id', auth,getSiteEngById)
    router.put('/update_site_eng/:id',auth,Iupload.any(), updateSiteEng)
    router.delete('/delete_site_eng/:id',auth, deleteSiteEng)
    
    router.put('/update_steps/:BuyEquipment_id',auth, updateSteps)
    router.delete('/delete_steps/:BuyEquipment_id',auth, deleteStepsForEquipment)






    module.exports = router 
