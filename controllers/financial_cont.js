const M_Financial = require('../models/financial/medical_financial');
const E_Financial = require('../models/financial/eng_financial');
const C_Financial = require('../models/financial/commerce_financial');

const createMEDFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { month, total_income, revenues, expenses, therapeutic_services, visiting_services, cosmetic, slimming, eye_surgery, oncology, orthopedic, dental, physical_therapy } = req.body;
        
        const documentFile = req.files?.find(f => f.fieldname === 'document');
        
        const newRecord = new M_Financial({
            month,
            total_income,
            revenues,
            expenses,
            therapeutic_services,
            visiting_services,
            cosmetic,
            slimming,
            eye_surgery,
            oncology,
            orthopedic,
            dental,
            physical_therapy,
            document: documentFile ? `http://localhost:3000/uploads/${documentFile.filename}` : null
        });

        await newRecord.save();
        res.status(201).json("Financial record added successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getAllMEDFinancialRecords = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const records = await M_Financial.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getMEDFinancialRecordById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const record = await M_Financial.findById(id);

        if (!record) {
            return res.status(404).json("Financial record not found");
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const updateMEDFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

        const documentFile = req.files?.find(f => f.fieldname === 'documents');
        if (documentFile) {
            updatedData.documents = `http://localhost:3000/uploads/${documentFile.filename}`;
        }

        const record = await M_Financial.findByIdAndUpdate(id, updatedData, { new: true });

        if (!record) {
            return res.status(404).json("Financial record not found");
        }

        res.status(200).json("Financial record updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const deleteMEDFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const record = await M_Financial.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json("Financial record not found");
        }

        res.status(200).json("Financial record deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

///////////////////////////////////////////////////////////



const createENGFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { month, total_income, revenues, expenses, revenues_technical_service, expenses_technical_service, consulting_and_recruitment, engineering_equipment, engineering_projects } = req.body;
        
        const documentFile = req.files?.find(f => f.fieldname === 'document');
        
        const newRecord = new E_Financial({
            month,
            total_income,
            revenues,
            expenses,
            revenues_technical_service,
            expenses_technical_service,
            consulting_and_recruitment,
            engineering_equipment,
            engineering_projects,
            document: documentFile ? `http://localhost:3000/uploads/${documentFile.filename}` : null
        });

        await newRecord.save();
        res.status(201).json("Engineering financial record added successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getAllENGFinancialRecords = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const records = await E_Financial.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getENGFinancialRecordById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const record = await E_Financial.findById(id);

        if (!record) {
            return res.status(404).json("Financial record not found");
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const updateENGFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

        const documentFile = req.files?.find(f => f.fieldname === 'document');
        if (documentFile) {
            updatedData.document = `http://localhost:3000/uploads/${documentFile.filename}`;
        }

        const record = await E_Financial.findByIdAndUpdate(id, updatedData, { new: true });

        if (!record) {
            return res.status(404).json("Financial record not found");
        }

        res.status(200).json("Engineering financial record updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const deleteENGFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const record = await E_Financial.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json("Financial record not found");
        }

        res.status(200).json("Engineering financial record deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

////////////////////////////////////////////////////////////

const createCommerceFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { month, total_income, expenses, our_products, general_products } = req.body;
        
        const documentFile = req.files?.find(f => f.fieldname === 'document');
        
        const newRecord = new C_Financial({
            month,
            total_income,
            expenses,
            our_products,
            general_products,
            document: documentFile ? `http://localhost:3000/uploads/${documentFile.filename}` : null
        });

        await newRecord.save();
        res.status(201).json("Commerce financial record added successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getAllCommerceFinancialRecords = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const records = await C_Financial.find();
        res.status(200).json(records);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getCommerceFinancialRecordById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const record = await C_Financial.findById(id);

        if (!record) {
            return res.status(404).json("Commerce financial record not found");
        }

        res.status(200).json(record);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const updateCommerceFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

        const documentFile = req.files?.find(f => f.fieldname === 'document');
        if (documentFile) {
            updatedData.document = `http://localhost:3000/uploads/${documentFile.filename}`;
        }

        const record = await C_Financial.findByIdAndUpdate(id, updatedData, { new: true });

        if (!record) {
            return res.status(404).json("Commerce financial record not found");
        }

        res.status(200).json("Commerce financial record updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const deleteCommerceFinancialRecord = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const record = await C_Financial.findByIdAndDelete(id);

        if (!record) {
            return res.status(404).json("Commerce financial record not found");
        }

        res.status(200).json("Commerce financial record deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};




module.exports = { 
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

    
    
    
    };
