const express=require('express');
const router = express.Router();

const {auth}=require('../middleware/auth')
const Istorage=require("../middleware/multer")

const  {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,

    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,

    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest,

    updateStepsForRequest,
    deleteStepsForRequest

} = require("../controllers/form_commerce_cont");

router.post('/create_product',auth,Istorage.any(),createProduct);

router.get('/get_all_products' ,auth,getAllProducts);

router.get('/get_product/:id',auth,getProductById);

router.put('/update_product/:id',auth,Istorage.any(),updateProduct);

router.delete('/delete_product/:id',auth,deleteProduct);

///////////////////////////////////////////////////////////////////

router.post('/create_supplier',auth,Istorage.any(),createSupplier);

router.get('/get_all_suppliers',auth,getAllSuppliers);

router.get('/get_supplier/:id',auth,getSupplierById);

router.put('/update_supplier/:id',auth,Istorage.any(),updateSupplier);

router.delete('/delete_supplier/:id',auth,deleteSupplier);

//////////////////////////////////////////////////////////////////////

router.post('/create_request',auth,createRequest);

router.get('/get_all_requests',auth,getAllRequests);

router.get('/get_request/:id',auth,getRequestById);

router.put('/update_request/:id',auth,updateRequest);

router.delete('/delete_request/:id',auth,deleteRequest);

router.put('/update/tracking/:requestId/:productId',auth, updateStepsForRequest);


router.delete('/delete/tracking/:requestId/:productId',auth, deleteStepsForRequest);


module.exports = router
