const express = require("express")
const router =  express.Router()

const { 
    createMEDFinancialRecord,
    getAllMEDFinancialRecords, 
    getMEDFinancialRecordById, 
    updateMEDFinancialRecord, 
    deleteMEDFinancialRecord ,

     createENGFinancialRecord,
     getAllENGFinancialRecords,
     getENGFinancialRecordById, 
     updateENGFinancialRecord,
     deleteENGFinancialRecord,

     createCommerceFinancialRecord,
     getAllCommerceFinancialRecords,
     getCommerceFinancialRecordById, 
     updateCommerceFinancialRecord, 
     deleteCommerceFinancialRecord,
    
    
    }=require("../controllers/financial_cont")

    const {auth}=require("../middleware/auth.js")
    const Istorage=require("../middleware/multer")

    router.post('/medical/create', auth , Istorage.any(), createMEDFinancialRecord)
    router.get('/medical/get_all', auth , getAllMEDFinancialRecords)
    router.get('/medical/get/:id', auth , getMEDFinancialRecordById)
    router.put('/medical/edit/:id', auth , Istorage.any(), updateMEDFinancialRecord)
    router.delete('/medical/delete/:id', auth , deleteMEDFinancialRecord)


    router.post('/eng/create', auth , Istorage.any(), createENGFinancialRecord)
    router.get('/eng/get_all', auth , getAllENGFinancialRecords)
    router.get('/eng/get/:id', auth , getENGFinancialRecordById)
    router.put('/eng/edit/:id', auth , Istorage.any(), updateENGFinancialRecord)
    router.delete('/eng/delete/:id', auth , deleteENGFinancialRecord)


    router.post('/commerce/create', auth , Istorage.any(), createCommerceFinancialRecord)
    router.get('/commerce/get_all', auth , getAllCommerceFinancialRecords)
    router.get('/commerce/get/:id', auth , getCommerceFinancialRecordById)
    router.put('/commerce/edit/:id', auth , Istorage.any(), updateCommerceFinancialRecord)
    router.delete('/commerce/delete/:id', auth , deleteCommerceFinancialRecord)




module.exports =router;
