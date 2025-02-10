const Product = require('../models/commerce/products_model');
const Supplier = require('../models/commerce/suppliers_model'); 
const Request = require('../models/commerce/request_product_model');

const nodemailer = require('nodemailer');

const createProduct = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const {
            product_name,
            quantity,
            price,
            products_type,
            available_colors,
            available_size,
            barcode,
            warranty,
            additional_features,
            brand,
        } = req.body;


        const productImageFile = req.files?.find(f => f.fieldname === 'image');
        const imageUrl = productImageFile ? `http://localhost:3000/uploads/${productImageFile.filename}` : null;

       
        const colorsArray = typeof available_colors === 'string' 
            ? JSON.parse(available_colors.replace(/'/g, '"')) 
            : available_colors || [];

        const sizesArray = typeof available_size === 'string' 
            ? JSON.parse(available_size.replace(/'/g, '"')) 
            : available_size || [];

      
        const newProduct = new Product({
            product_name,
            image: imageUrl,
            quantity,
            price,
            products_type,
            available_colors: colorsArray,
            available_size: sizesArray,
            barcode,
            warranty,
            additional_features,
            brand,
        });

        await newProduct.save();
        res.status(201).json("Product added successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getAllProducts = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }
       
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const getProductById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json("Product not found");
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const updateProduct = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;


        const productImageFile = req.files?.find(f => f.fieldname === 'image');
        if (productImageFile) {
            updatedData.image = `http://localhost:3000/uploads/${productImageFile.filename}`;
        }

        if (updatedData.available_colors && typeof updatedData.available_colors === 'string') {
            updatedData.available_colors = JSON.parse(updatedData.available_colors.replace(/'/g, '"'));
        }
        if (updatedData.available_size && typeof updatedData.available_size === 'string') {
            updatedData.available_size = JSON.parse(updatedData.available_size.replace(/'/g, '"'));
        }


        const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        if (!product) {
            return res.status(404).json("Product not found");
        }

        res.status(200).json("Product updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const deleteProduct = async (req, res) => {
    try {
        const user = req.user;

      
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to perform this action!");
        }

        const { id } = req.params;

     
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json("Product not found");
        }

     
        await Product.findByIdAndDelete(id);

       
        await Request.updateMany(
            { "products.product_id": id },
            { $pull: { products: { product_id: id } } }
        );

        res.status(200).json("Product deleted successfully and removed from requests.");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



////////////////////////////////////////////////////


const createSupplier = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const {
            name,
            email,
            phone,
            country,
            city,
            products_type,
            export_type,
            details_would_like_to_add
        } = req.body;

     
        const personalPhotoFile = req.files?.find(f => f.fieldname === 'personal_photo');
        const certificatesFile = req.files?.find(f => f.fieldname === 'certificates');
        const pricesListFile = req.files?.find(f => f.fieldname === 'prices_list');
        const termsFile = req.files?.find(f => f.fieldname === 'terms_of_dealing');

        const newSupplier = new Supplier({
            name,
            personal_photo: personalPhotoFile ? `http://localhost:3000/uploads/${personalPhotoFile.filename}` : null,
            email,
            phone,
            country,
            city,
            products_type,
            export_type,
            certificates: certificatesFile ? `http://localhost:3000/uploads/${certificatesFile.filename}` : null,
            prices_list: pricesListFile ? `http://localhost:3000/uploads/${pricesListFile.filename}` : null,
            terms_of_dealing: termsFile ? `http://localhost:3000/uploads/${termsFile.filename}` : null,
            details_would_like_to_add
        });

        await newSupplier.save();
        res.status(201).json("Supplier added successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getAllSuppliers = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const suppliers = await Supplier.find();
        res.status(200).json(suppliers);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getSupplierById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;

        const supplier = await Supplier.findById(id);

        if (!supplier) {
            return res.status(404).json("Supplier not found");
        }

        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const updateSupplier = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;
        const updatedData = req.body;

       
        const personalPhotoFile = req.files?.find(f => f.fieldname === 'personal_photo');
        const certificatesFile = req.files?.find(f => f.fieldname === 'certificates');
        const pricesListFile = req.files?.find(f => f.fieldname === 'prices_list');
        const termsFile = req.files?.find(f => f.fieldname === 'terms_of_dealing');

        if (personalPhotoFile) {
            updatedData.personal_photo = `http://localhost:3000/uploads/${personalPhotoFile.filename}`;
        }
        if (certificatesFile) {
            updatedData.certificates = `http://localhost:3000/uploads/${certificatesFile.filename}`;
        }
        if (pricesListFile) {
            updatedData.prices_list = `http://localhost:3000/uploads/${pricesListFile.filename}`;
        }
        if (termsFile) {
            updatedData.terms_of_dealing = `http://localhost:3000/uploads/${termsFile.filename}`;
        }

        const supplier = await Supplier.findByIdAndUpdate(id, updatedData, { new: true });

        if (!supplier) {
            return res.status(404).json("Supplier not found");
        }

        res.status(200).json("Supplier updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const deleteSupplier = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not authorized to access this page!");
        }

        const { id } = req.params;

        const supplier = await Supplier.findByIdAndDelete(id);

        if (!supplier) {
            return res.status(404).json("Supplier not found");
        }

        res.status(200).json("Supplier deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};

//////////////////////////////////////////////////////////////



const createRequest = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { name, email, phone, products } = req.body; 

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json("Products array is required and cannot be empty");
        }

       
        const productDetails = await Product.find({ _id: { $in: products } });

        if (productDetails.length !== products.length) {
            return res.status(404).json("Some products not found in the database");
        }

    
        const newRequest = new Request({
            name,
            email,
            phone,
            products: productDetails.map(product => ({
                product_id: product._id,
                product_name: product.product_name,
                image: product.image,
                quantity: product.quantity,
                price: product.price,
                products_type: product.products_type,
                available_colors: product.available_colors,
                available_size: product.available_size,
                barcode: product.barcode,
                warranty: product.warranty,
                additional_features: product.additional_features,
                brand:product.brand,
            })),
        });

        await newRequest.save();
        res.status(201).json("Request added successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getAllRequests = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const requests = await Request.find();
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const getRequestById = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;

        const request = await Request.findById(id);

        if (!request) {
            return res.status(404).json("Request not found");
        }

        res.status(200).json(request);
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const updateRequest = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;
        const { name, email, phone, products } = req.body;

        if (products && (!Array.isArray(products) || products.length === 0)) {
            return res.status(400).json("Products array cannot be empty if provided");
        }

        let updatedData = { name, email, phone };

        if (products) {
            const productDetails = await Product.find({ _id: { $in: products } });

            if (productDetails.length !== products.length) {
                return res.status(404).json("Some products not found in the database");
            }

            updatedData.products = productDetails.map(product => ({
                product_id: product._id,
                product_name: product.product_name,
                image: product.image,
                quantity: product.quantity,
                price: product.price,
                products_type: product.products_type,
                available_colors: product.available_colors,
                available_size: product.available_size,
                barcode: product.barcode,
                warranty: product.warranty,
                additional_features: product.additional_features,
                brand:product.brand,
            }));
        }

        const request = await Request.findByIdAndUpdate(id, updatedData, { new: true });

        if (!request) {
            return res.status(404).json("Request not found");
        }

        res.status(200).json("Request updated successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const deleteRequest = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You are not accessing this page!");
        }

        const { id } = req.params;

        const request = await Request.findByIdAndDelete(id);

        if (!request) {
            return res.status(404).json("Request not found");
        }

        res.status(200).json("Request deleted successfully");
    } catch (error) {
        res.status(500).json(error.message);
    }
};


const updateStepsForRequest = async (req, res) => {
    try {
        const user = req.user;
        if (!user || !user.isManager) {
            return res.status(403).json("You do not have access to this page!");
        }

        const requestId = req.params.requestId;
        const { steps } = req.body;

        if (!steps || !Array.isArray(steps) || steps.length === 0) {
            return res.status(400).json("Tracking steps are required.");
        }

      
        const requestDoc = await Request.findByIdAndUpdate(
            requestId,
            { $push: { steps: { $each: steps } } },
            { new: true }
        ).populate("products.product_id");

        if (!requestDoc) {
            return res.status(404).json("Request not found.");
        }

        const transporter = nodemailer.createTransport({
                host: "smtp.hostinger.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.USER_EMAIL,
                    pass: process.env.USER_PASS,
                },
            });

     let emailContent = `
    <div style="font-family: 'Poppins', Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
        <h2 style="color: #4CAF50; text-align: center;">🚚 Shipment Tracking Update</h2>
        <p style="font-size: 18px; font-weight: 600; color: #4CAF50; margin-bottom: 10px;">
            Dear Customer,
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.5;">
            Here is the latest update on your shipment:
        </p>

        <div style="background-color: #ffffff; padding: 15px; margin-bottom: 10px; border-radius: 5px; border-left: 5px solid #4CAF50;">
            <h3 style="color: #4CAF50;">📦 Products in this shipment:</h3>
            <ul>
`;


requestDoc.products.forEach(product => {
    emailContent += `
        <li style="font-size: 14px; color: #333; margin-bottom: 5px;">
            <b>🛒 ${product.product_name || "Unknown Product"}</b> -  
            <b>Barcode:</b> <span style="color: #1155CE;">${product.barcode || "N/A"}</span>
        </li>
    `;
});


emailContent += `
            </ul>
        </div>

        <h4 style="color: #333; margin-top: 10px;">📍 Shipment Steps:</h4>
`;


steps.forEach(step => {
    let status = step.didnot_start ? "Not started yet" :
                 step.in_progress ? "In progress" :
                 step.complete ? "Completed" : "Unknown";

    emailContent += `
        <div style="background-color: #f1f1f1; padding: 10px; border-radius: 5px; margin-top: 5px;">
            <p><b>🛠 Step:</b> ${step.step}</p>
            <p><b>🚦 Status:</b> ${status}</p>
            ${step.location ? `<p><b>📌 Location:</b> ${step.location}</p>` : ''}
            ${step.late_reason ? `<p><b>⏳ Reason for Delay:</b> ${step.late_reason}</p>` : ''}
        </div>
    `;
});

emailContent += `
    <p style="margin-top: 20px; font-size: 14px; color: #777;">Thank you for choosing our service!</p>
    </div>
`;

        await transporter.sendMail({
            from: process.env.USER_EMAIL,
            to: requestDoc.user?.email || requestDoc.email, 
            subject: "Shipment Tracking Update",
            html: emailContent,
        });

        res.status(200).json("Tracking steps updated and email sent successfully.");
    } catch (error) {
        console.error("Error updating tracking steps:", error);
        res.status(500).json({ message: error.message });
    }
};



  const deleteStepsForRequest = async (req, res) => {
    try {
      const user = req.user; 
      if (!user || !user.isAdmin) {
        return res.status(403).json("You are not authorized to access this page!");
      }
  
      
      const requestId = req.params.requestId;
  
  
   
      const requestDoc = await Request.findById(requestId);
      if (!requestDoc) {
        return res.status(404).json({ message: "Request not found" });
      }
  
     
       const result = await Request.updateOne(
            { "_id": requestId }, 
            { $set: { steps: [] } }
        );
        
      await requestDoc.save();
  
      res.status(200).json("Tracking steps deleted successfully");
        
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
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
};
