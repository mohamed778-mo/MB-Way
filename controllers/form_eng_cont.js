const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
require("dotenv").config();

const Consultation = require('../models/eng/consultation_eng_model');
const Customs = require('../models/eng/customs_clearance_model');
const Equipment = require('../models/eng/equipment_model');
const BuyEquipment = require('../models/eng//form_buy_equi_model');
const EmployEng = require('../models/eng/form_request_employ_eng');
const Site = require('../models/eng/site_model');

const createConsultation = async (req, res) => {
    try {
        const { 
            customer_name,
            company_name,
            email,
            phone,
            engineering_site_address,
            project_name,
            project_type,
            type_of_consultation_required,
            current_site_status,
            special_requirements_or_comments
        } = req.body;

        
        const readyProjectDocFile = req.files?.find(f => f.fieldname === 'ready_project_documents');
        const engineeringDrawingsFile = req.files?.find(f => f.fieldname === 'engineering_drawings');

        const readyProjectDocumentsLink = readyProjectDocFile 
            ? `http://localhost:3000/uploads/${readyProjectDocFile.filename}` 
            : null;

        const engineeringDrawingsLink = engineeringDrawingsFile 
            ? `http://localhost:3000/uploads/${engineeringDrawingsFile.filename}` 
            : null;

        const newConsultation = new Consultation({
            customer_name,
            company_name,
            email,
            phone,
            engineering_site_address,
            project_name,
            project_type,
            type_of_consultation_required,
            current_site_status,
            ready_project_documents: readyProjectDocumentsLink,
            engineering_drawings: engineeringDrawingsLink,
            special_requirements_or_comments,
        });

        await newConsultation.save();
        res.status(201).json( "Consultation added successfully");
    } catch (error) {
        res.status(500).json( error.message );
    }
}


const getAllConsultations = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }
        const consultations = await Consultation.find();
        res.status(200).json(consultations);
    } catch (error) {
        res.status(500).json( error.message );
    }
}

const getConsultationById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }


        const { id } = req.params;
        const consultation = await Consultation.findById(id);

        if (!consultation) {
            return res.status(404).json( "Consultation not found" );
        }

        res.status(200).json(consultation);
    } catch (error) {
        res.status(500).json( error.message);
    }
}

const updateConsultation = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

      
        const readyProjectDocFile = req.files?.find(f => f.fieldname === 'ready_project_documents');
        const engineeringDrawingsFile = req.files?.find(f => f.fieldname === 'engineering_drawings');

        if (readyProjectDocFile) {
            updatedData.ready_project_documents = `http://localhost:3000/uploads/${readyProjectDocFile.filename}`;
        }

        if (engineeringDrawingsFile) {
            updatedData.engineering_drawings = `http://localhost:3000/uploads/${engineeringDrawingsFile.filename}`;
        }

        const consultation = await Consultation.findByIdAndUpdate(id, updatedData, { new: true });

        if (!consultation) {
            return res.status(404).json( "Consultation not found" );
        }

        res.status(200).json( "Consultation updated successfully");
    } catch (error) {
        res.status(500).json( error.message );
    }
}

const deleteConsultation =async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;

        const consultation = await Consultation.findByIdAndDelete(id);

        if (!consultation) {
            return res.status(404).json("Consultation not found" );
        }

        res.status(200).json("Consultation deleted successfully" );
    } catch (error) {
        res.status(500).json( error.message );
    }
}


/////////////////////////////////////////////

const createCustoms = async (req, res) => {
    try {
        const {
            company_name,
            name_of_esponsible_person,
            email,
            phone,
            bill_of_lading_number,
            consignment_products,
            quantity_of_products,
            country_of_origin,
            arrival_port,
            shipment_type,
            date_of_shipment_arrival,
            expected_financial_cost,
            expected_date_of_delivery,
            details_you_would_like_to_add
        } = req.body;

        const recentPhotosFile = req.files?.find(f => f.fieldname === 'recent_photos_of_the_site');
        const billOfLadingFile = req.files?.find(f => f.fieldname === 'bill_of_lading');
        const purchaseInvoiceFile = req.files?.find(f => f.fieldname === 'purchase_invoice');
        const certificateOfOriginFile = req.files?.find(f => f.fieldname === 'certificate_of_origin');
        const packingListFile = req.files?.find(f => f.fieldname === 'packing_list');
        const importPermitFile = req.files?.find(f => f.fieldname === 'import_permit');
        const techSpecsFile = req.files?.find(f => f.fieldname === 'technical_specifications_certificates');
        const equipmentDataFile = req.files?.find(f => f.fieldname === 'equipment_data');
        const acknowledgmentFile = req.files?.find(f => f.fieldname === 'acknowledgment_and_pledge');

        const newCustoms = new Customs({
            company_name,
            name_of_esponsible_person,
            email,
            phone,
            bill_of_lading_number,
            consignment_products,
            quantity_of_products,
            country_of_origin,
            arrival_port,
            shipment_type,
            date_of_shipment_arrival,
            expected_financial_cost,
            expected_date_of_delivery,
            details_you_would_like_to_add,
            recent_photos_of_the_site: recentPhotosFile ? `http://localhost:3000/uploads/${recentPhotosFile.filename}` : null,
            bill_of_lading: billOfLadingFile ? `http://localhost:3000/uploads/${billOfLadingFile.filename}` : null,
            purchase_invoice: purchaseInvoiceFile ? `http://localhost:3000/uploads/${purchaseInvoiceFile.filename}` : null,
            certificate_of_origin: certificateOfOriginFile ? `http://localhost:3000/uploads/${certificateOfOriginFile.filename}` : null,
            packing_list: packingListFile ? `http://localhost:3000/uploads/${packingListFile.filename}` : null,
            import_permit: importPermitFile ? `http://localhost:3000/uploads/${importPermitFile.filename}` : null,
            technical_specifications_certificates: techSpecsFile ? `http://localhost:3000/uploads/${techSpecsFile.filename}` : null,
            equipment_data: equipmentDataFile ? `http://localhost:3000/uploads/${equipmentDataFile.filename}` : null,
            acknowledgment_and_pledge: acknowledgmentFile ? `http://localhost:3000/uploads/${acknowledgmentFile.filename}` : null
        });

        await newCustoms.save();
        res.status(201).json("Customs Clearance created successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getAllCustoms = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const customs = await Customs.find();
        res.status(200).json(customs);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getCustomsById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const customs = await Customs.findById(id);
        if (!customs) {
            return res.status(404).json("Customs Clearance not found");
        }
        res.status(200).json(customs);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const updateCustoms = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

       
        const recentPhotosFile = req.files?.find(f => f.fieldname === 'recent_photos_of_the_site');
        const billOfLadingFile = req.files?.find(f => f.fieldname === 'bill_of_lading');
        const purchaseInvoiceFile = req.files?.find(f => f.fieldname === 'purchase_invoice');
        const certificateOfOriginFile = req.files?.find(f => f.fieldname === 'certificate_of_origin');
        const packingListFile = req.files?.find(f => f.fieldname === 'packing_list');
        const importPermitFile = req.files?.find(f => f.fieldname === 'import_permit');
        const techSpecsFile = req.files?.find(f => f.fieldname === 'technical_specifications_certificates');
        const equipmentDataFile = req.files?.find(f => f.fieldname === 'equipment_data');
        const acknowledgmentFile = req.files?.find(f => f.fieldname === 'acknowledgment_and_pledge');

      
        if (recentPhotosFile) {
            updatedData.recent_photos_of_the_site = `http://localhost:3000/uploads/${recentPhotosFile.filename}`;
        }
        if (billOfLadingFile) {
            updatedData.bill_of_lading = `http://localhost:3000/uploads/${billOfLadingFile.filename}`;
        }
        if (purchaseInvoiceFile) {
            updatedData.purchase_invoice = `http://localhost:3000/uploads/${purchaseInvoiceFile.filename}`;
        }
        if (certificateOfOriginFile) {
            updatedData.certificate_of_origin = `http://localhost:3000/uploads/${certificateOfOriginFile.filename}`;
        }
        if (packingListFile) {
            updatedData.packing_list = `http://localhost:3000/uploads/${packingListFile.filename}`;
        }
        if (importPermitFile) {
            updatedData.import_permit = `http://localhost:3000/uploads/${importPermitFile.filename}`;
        }
        if (techSpecsFile) {
            updatedData.technical_specifications_certificates = `http://localhost:3000/uploads/${techSpecsFile.filename}`;
        }
        if (equipmentDataFile) {
            updatedData.equipment_data = `http://localhost:3000/uploads/${equipmentDataFile.filename}`;
        }
        if (acknowledgmentFile) {
            updatedData.acknowledgment_and_pledge = `http://localhost:3000/uploads/${acknowledgmentFile.filename}`;
        }

      
        const customs = await Customs.findByIdAndUpdate(id, updatedData, { new: true });

        if (!customs) {
            return res.status(404).json("Customs Clearance not found");
        }

        res.status(200).json("Customs Clearance updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const deleteCustoms = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const customs = await Customs.findByIdAndDelete(id);

        if (!customs) {
            return res.status(404).json("Customs Clearance not found");
        }

        res.status(200).json("Customs Clearance deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


///////////////////////////////////////////////////////


const createEquipment = async (req, res) => {
    try {
        const {
            equipment_name,
            equipment_type,
            model,
            serial_number,
            brand,
            start,
            end,
            price,
            quantity,
            warranty_duration,
            condition_equipment,
            which_is_covered_by_the_warranty,
            the_party_responsible_for_the_guarantee
        } = req.body;

        const imageFile = req.files?.find(f => f.fieldname === 'image');

        const imageLink = imageFile 
            ? `http://localhost:3000/uploads/${imageFile.filename}` 
            : null;

        const newEquipment = new Equipment({
            equipment_name,
            equipment_type,
            image: imageLink,
            model,
            serial_number,
            brand,
            start,
            end,
            price,
            quantity,
            warranty_duration,
            condition_equipment,
            which_is_covered_by_the_warranty,
            the_party_responsible_for_the_guarantee
        });

        await newEquipment.save();
        res.status(201).json("Equipment added successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getAllEquipment = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const equipment = await Equipment.find();
        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getEquipmentById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const equipment = await Equipment.findById(id);

        if (!equipment) {
            return res.status(404).json("Equipment not found");
        }

        res.status(200).json(equipment);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const updateEquipment = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

        const imageFile = req.files?.find(f => f.fieldname === 'image');

        if (imageFile) {
            updatedData.image = `http://localhost:3000/uploads/${imageFile.filename}`;
        }

        const equipment = await Equipment.findByIdAndUpdate(id, updatedData, { new: true });

        if (!equipment) {
            return res.status(404).json("Equipment not found");
        }

        res.status(200).json("Equipment updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;

        const equipment = await Equipment.findByIdAndDelete(id);

        if (!equipment) {
            return res.status(404).json("Equipment not found");
        }

        res.status(200).json("Equipment deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

///////////////////////////////////////////////////////
const createBuyEquipment = async (req, res) => {
    try {
        const { company_name, email, phone, equipment } = req.body;


        if (!Array.isArray(equipment) || equipment.length === 0) {
            return res.status(400).json("Equipment list is required and should be an array of IDs");
        }

  
        const validEquipmentIds = equipment.every((id) => mongoose.Types.ObjectId.isValid(id));
        if (!validEquipmentIds) {
            return res.status(400).json("All equipment IDs must be valid ObjectIds");
        }


        const equipmentDetails = await Equipment.find({
            _id: { $in: equipment },
        });

        if (equipmentDetails.length !== equipment.length) {
            return res.status(404).json("Some equipment IDs are not found");
        }

      
        const equipmentData = equipmentDetails.map((eq) => ({
            equipment_id: eq._id,
            equipment_name: eq.equipment_name,
            equipment_type: eq.equipment_type,
            image: eq.image,
            model: eq.model,
            serial_number: eq.serial_number,
            brand: eq.brand,
            start: eq.start,
            end: eq.end,
            price: eq.price,
            quantity: eq.quantity,
            warranty_duration: eq.warranty_duration,
            condition_equipment: eq.condition_equipment,
            which_is_covered_by_the_warranty: eq.which_is_covered_by_the_warranty,
            the_party_responsible_for_the_guarantee: eq.the_party_responsible_for_the_guarantee,
        }));

       
        const newBuyEquipment = new BuyEquipment({
            company_name,
            email,
            phone,
            equipment: equipmentData, 
        });

        await newBuyEquipment.save();

        res.status(201).json("Form for Buying Equipment created successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};



const getAllBuyEquipment = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const buyEquipments = await BuyEquipment.find().populate('equipment.equipment_id');
        res.status(200).json(buyEquipments);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getBuyEquipmentById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const buyEquipment = await BuyEquipment.findById(id).populate('equipment.equipment_id');
        
        if (!buyEquipment) {
            return res.status(404).json("Form for Buying Equipment not found");
        }
        
        res.status(200).json(buyEquipment);
    } catch (error) {
        res.status(500).json(error.message);
    }
};



const updateBuyEquipment = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

       
        if (updatedData.equipment) {
            if (!Array.isArray(updatedData.equipment)) {
                return res.status(400).json("Equipment must be an array of IDs");
            }

          
            const validEquipmentIds = updatedData.equipment.every((id) => mongoose.Types.ObjectId.isValid(id));
            if (!validEquipmentIds) {
                return res.status(400).json("All equipment IDs must be valid ObjectIds");
            }

           
            updatedData.equipment = updatedData.equipment.map((id) => ({ equipment_id: id }));
        }

        const buyEquipment = await BuyEquipment.findByIdAndUpdate(id, updatedData, { new: true });

        if (!buyEquipment) {
            return res.status(404).json("Form for Buying Equipment not found");
        }

        res.status(200).json("Form for Buying Equipment updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};



const deleteBuyEquipment = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const buyEquipment = await BuyEquipment.findByIdAndDelete(id);

        if (!buyEquipment) {
            return res.status(404).json("Buy Equipment not found");
        }

        res.status(200).json("Form for Buying Equipment deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


////////////////////////////////////////////////////////////////

const updateSteps = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const  id  = req.params.BuyEquipment_id;
        const { steps } = req.body; 

     
        const updatedForm = await BuyEquipment.findByIdAndUpdate(id, { $push: { steps: { $each: steps } } }, { new: true });

      
        if (updatedForm) {
          
            const transporter = nodemailer.createTransport({
                service: process.env.SERVICE,
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS,
                },
            });

          
            let emailContent = "<b>تم تحديث مراحل المعدات</b><p>السلام عليكم،</p>";

            updatedForm.steps.forEach(step => {
                let status = '';
                if (step.didnot_start) status = "لم تبدأ بعد";
                if (step.in_progress) status = "قيد التنفيذ";
                if (step.complete) status = "تم الانتهاء منها";

                emailContent += `<p>المعدة في مرحلة: ${status}</p>`;
                if (step.step) emailContent += `<p>تفاصيل المرحله: ${step.step}</p>`;
                if (step.location) emailContent += `<p>الموقع: ${step.location}</p>`;
                if (step.late_reason) emailContent += `<p>سبب التأخير: ${step.late_reason}</p>`;
            });

          
            const info = await transporter.sendMail({
                from: process.env.USER_EMAIL,
                to: updatedForm.email,
                subject: "تحديث حالة المعدات",
                html: emailContent,
            });

            res.status(200).json("تم تحديث المراحل وإرسال البريد الإلكتروني بنجاح.");
        } else {
            res.status(404).json("المعدات غير موجودة");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteStepsForEquipment = async (req, res) => {
    try {
        const user = req.user; 
        if (!user.isAdmin) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const equipmentId = req.params.BuyEquipment_id ;

       
        const result = await BuyEquipment.updateOne(
            { "equipment.equipment_id": equipmentId }, 
            { $set: { steps: [] } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json("Equipment not found");
        }

        res.status(200).json("Steps deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};




/////////////////////////////////////////////

const createEmployEng = async (req, res) => {
    try {
        const { 
            company_name, 
            name_of_esponsible_person, 
            email, 
            phone, 
            company_address, 
            job_title, 
            number_of_employees_required, 
            contract_duration, 
            contract_type, 
            expected_Salary, 
            start_date, 
            job_description, 
            required_experiences, 
            additional_notes 
        } = req.body;

        const newEmployEng = new EmployEng({
            company_name,
            name_of_esponsible_person,
            email,
            phone,
            company_address,
            job_title,
            number_of_employees_required,
            contract_duration,
            contract_type,
            expected_Salary,
            start_date,
            job_description,
            required_experiences,
            additional_notes
        });

        await newEmployEng.save();
        res.status(201).json("Employment Engagement created successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getAllEmployEng = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }
        const employEngs = await EmployEng.find();
        res.status(200).json(employEngs);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getEmployEngById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const employEng = await EmployEng.findById(id);
        if (!employEng) {
            return res.status(404).json("Employment Engagement not found");
        }
        res.status(200).json(employEng);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const updateEmployEng = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

        const employEng = await EmployEng.findByIdAndUpdate(id, updatedData, { new: true });

        if (!employEng) {
            return res.status(404).json("Employment Engagement not found");
        }

        res.status(200).json("Employment Engagement updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const deleteEmployEng = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const employEng = await EmployEng.findByIdAndDelete(id);

        if (!employEng) {
            return res.status(404).json("Employment Engagement not found");
        }

        res.status(200).json("Employment Engagement deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

/////////////////////////////////////////////

const createSiteEng = async (req, res) => {
    try {
        const {
            company_name,
            name_of_esponsible_person,
            email,
            phone,
            project_name,
            on_site_staff,
            number_of_employees_required,
            participating_companies_or_contractors,
            company_address,
            required_works,
            project_type,
            expected_financial_cost,
            project_start_date,
            project_end_date,
            special_instructions_or_additional_requests,
            current_problems_on_the_site,
            contract_type,
            contract_duration,
            project_space
        } = req.body;

        const recentPhotosFile = req.files?.find(f => f.fieldname === 'recent_photos_of_the_site');
        const techReportsFile = req.files?.find(f => f.fieldname === 'technical_reports');
        const contractAgreementsFile = req.files?.find(f => f.fieldname === 'contract_agreements_with_suppliers');

        const newSiteEng = new Site({
            company_name,
            name_of_esponsible_person,
            email,
            phone,
            project_name,
            on_site_staff,
            number_of_employees_required,
            participating_companies_or_contractors,
            company_address,
            required_works,
            project_type,
            expected_financial_cost,
            project_start_date,
            project_end_date,
            special_instructions_or_additional_requests,
            current_problems_on_the_site,
            contract_type,
            contract_duration,
            project_space,
            recent_photos_of_the_site: recentPhotosFile ? `http://localhost:3000/uploads/${recentPhotosFile.filename}` : null,
            technical_reports: techReportsFile ? `http://localhost:3000/uploads/${techReportsFile.filename}` : null,
            contract_agreements_with_suppliers: contractAgreementsFile ? `http://localhost:3000/uploads/${contractAgreementsFile.filename}` : null
        });

        await newSiteEng.save();
        res.status(201).json("Site Engagement created successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getAllSiteEng = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const siteEngs = await Site.find();
        res.status(200).json(siteEngs);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getSiteEngById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const siteEng = await Site.findById(id);
        if (!siteEng) {
            return res.status(404).json("Site Engagement not found");
        }
        res.status(200).json(siteEng);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const updateSiteEng = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

        const recentPhotosFile = req.files?.find(f => f.fieldname === 'recent_photos_of_the_site');
        const techReportsFile = req.files?.find(f => f.fieldname === 'technical_reports');
        const contractAgreementsFile = req.files?.find(f => f.fieldname === 'contract_agreements_with_suppliers');

        if (recentPhotosFile) {
            updatedData.recent_photos_of_the_site = `http://localhost:3000/uploads/${recentPhotosFile.filename}`;
        }
        if (techReportsFile) {
            updatedData.technical_reports = `http://localhost:3000/uploads/${techReportsFile.filename}`;
        }
        if (contractAgreementsFile) {
            updatedData.contract_agreements_with_suppliers = `http://localhost:3000/uploads/${contractAgreementsFile.filename}`;
        }

        const siteEng = await Site.findByIdAndUpdate(id, updatedData, { new: true });

        if (!siteEng) {
            return res.status(404).json("Site Engagement not found");
        }

        res.status(200).json("Site Engagement updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const deleteSiteEng = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }
        
        const { id } = req.params;
        const siteEng = await Site.findByIdAndDelete(id);

        if (!siteEng) {
            return res.status(404).json("Site Engagement not found");
        }

        res.status(200).json("Site Engagement deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};





module.exports = {
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

    updateSteps,
    deleteStepsForEquipment
}
