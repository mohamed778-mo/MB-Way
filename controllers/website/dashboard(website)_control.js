// const DashAdmin = require("../../models/website/dashboard_admin_model");
// const Employee = require("../../models/employee_model");
// const Sections = require("../../models/website/sections_model");

// const bcryptjs = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();



// const dash_register = async (req, res) => {
//     try {
//         const { name, email, phone, password } = req.body;
//         const duplicatedEmail = await DashAdmin.findOne({ email });

//         if (duplicatedEmail) {
//             return res.status(400).send('Email already exists!!');
//         }


//         const newUser = new DashAdmin(
//             {
//                 name,
//                 email,
//                 phone,
//                 password
//             });
//         await newUser.save();

//         res.status(200).send('Registration is successful!!');
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };

// const dash_admin_Login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await DashAdmin.findOne({ email });

//         if (!user) {
//             return res.status(404).send( 'Email or Password is incorrect');
//         }

//         const isPassword = await bcryptjs.compare(password, user.password);
//         if (!isPassword) {
//             return res.status(404).send('Email or Password is incorrect');
//         }

//         const SECRETKEY = process.env.DSECRETKEY;
//         const token = jwt.sign({ id: user._id }, SECRETKEY);
//         res.cookie("access_token", `Bearer ${token}`, {
//             expires: new Date(Date.now() + 60 * 60 * 24 * 1024 * 300),
//             httpOnly: true,
//         });

//         user.tokens.push(token);
//         await user.save();


//         res.status(200).send({ access_token: `Bearer ${token}`, success: 'Login is successful!' });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };


// const add_section = async (req, res) => {
//     try {

//         const sectionFile = req.files?.find(f => f.fieldname === 'section_file');
//         const sectionPhotoLink = sectionFile ? `http://localhost:3000/uploads/${sectionFile.filename}` : null;


//         const {
//             name,
//             main_title,
//             subsidiary_title,
//             description,
//             services,
//             youtube_number,
//             instagram_number,
//             twitter_number,
//             tiktok_number,
//             linkedin_number,
//         } = req.body;


//         let Services;
//         try {
//             Services = JSON.parse(services);
//         } catch (err) {
//             return res.status(400).json({ message: 'Invalid services format.' });
//         }


//         const newSection = new Sections({
//             name,
//             main_title,
//             subsidiary_title,
//             description,
//             photo: sectionPhotoLink,
//             youtube_number,
//             instagram_number,
//             twitter_number,
//             tiktok_number,
//             linkedin_number,
//         });


//         for (const [index, service] of Services.entries()) {
//             const employee = await Employee.findById(service.employees.employee_id);
//             if (!employee) {
//                 return res.status(404).json({ message: `Employee with ID ${service.employees.employee_id} not found.` });
//             }

//             const serviceFile = req.files?.find(f => f.fieldname === `service_photo_${index}`);
//             const servicePhotoLink = serviceFile ? `http://localhost:3000/uploads/${serviceFile.filename}` : null;

//             newSection.services.push({
//                 name: service.name,
//                 description: service.description,
//                 questions_Answers: service.questions_Answers,
//                 employees: [
//                     {
//                         employee_id: employee._id,
//                         employee_name: employee.name,
//                         employee_job: employee.job,
//                     },
//                 ],
//                 photos: servicePhotoLink ? [{ photo: servicePhotoLink }] : [],
//                 type: service.type,
//                 price: service.price,
//             });
//         }

//         // Save the new section to the database
//         await newSection.save();
//         res.status(200).json({ message: 'Section successfully added!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//     }
// };


// const edit_section = async (req, res) => {
//     try {

//         const sectionId = req.params.section_id;
//         const existingSection = await Sections.findById(sectionId);
//         if (!existingSection) {
//             return res.status(404).json({ message: 'Section not found!' });
//         }


//         const sectionFile = req.files?.find(f => f.fieldname === 'section_file');
//         if (sectionFile) {
//             existingSection.photo = `http://localhost:3000/uploads/${sectionFile.filename}`;
//         }


//         const {
//             name,
//             main_title,
//             subsidiary_title,
//             description,
//             services,
//             youtube_number,
//             instagram_number,
//             twitter_number,
//             tiktok_number,
//             linkedin_number,
//         } = req.body;


//         existingSection.name = name || existingSection.name;
//         existingSection.main_title = main_title || existingSection.main_title;
//         existingSection.subsidiary_title = subsidiary_title || existingSection.subsidiary_title;
//         existingSection.description = description || existingSection.description;
//         existingSection.youtube_number = youtube_number || existingSection.youtube_number;
//         existingSection.instagram_number = instagram_number || existingSection.instagram_number;
//         existingSection.twitter_number = twitter_number || existingSection.twitter_number;
//         existingSection.tiktok_number = tiktok_number || existingSection.tiktok_number;
//         existingSection.linkedin_number = linkedin_number || existingSection.linkedin_number;

//         if (services) {
//             let parsedServices;
//             try {
//                 parsedServices = JSON.parse(services);
//             } catch (err) {
//                 return res.status(400).json({ message: 'Invalid services format.' });
//             }

//             existingSection.services = [];
//             for (const [index, service] of parsedServices.entries()) {
//                 const employee = await Employee.findById(service.employees.employee_id);
//                 if (!employee) {
//                     return res.status(404).json({ message: `Employee with ID ${service.employees.employee_id} not found.` });
//                 }
//                 const serviceFile = req.files?.find(f => f.fieldname === `service_photo_${index}`);
//                 const servicePhotoLink = serviceFile ? `http://localhost:3000/uploads/${serviceFile.filename}` : null;

//                 existingSection.services.push({
//                     name: service.name,
//                     description: service.description,
//                     questions_Answers: service.questions_Answers || [],
//                     employees: [
//                         {
//                             employee_id: employee._id,
//                             employee_name: employee.name,
//                             employee_job: employee.job,
//                         },
//                     ],
//                     photos: servicePhotoLink ? [{ photo: servicePhotoLink }] : [],
//                     type: service.type,
//                     price: service.price,
//                 });
//             }
//         }


//         await existingSection.save();
//         res.status(200).json({ message: 'Section successfully updated!' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//     }
// };

// const get_section = async (req, res) => {
//     try {
//         const section_id = req.params.section_id;
//         const section = Sections.findById(section_id)
//         if (!section) {
//             return res.status(404).json({ message: 'Section not found!' });
//         }
//         res.status(200).send(section);
//     }catch (e) {
//         return res.status(500).json(e.message);
//     }
// }

// const get_all_sections = async (req, res) => {
//     try {

//         const sections = Sections.find()

//         res.status(200).send(sections);
//     }catch (e) {
//         return res.status(500).json(e.message);
//     }
// }

// const get_service = async (req, res) => {
//     try {
//         const section_id = req.params.section_id;
//         const service_id = req.params.service_id;


//         const section = await Sections.findById(section_id);

//         if (!section) return res.status(404).json({ message: 'Section not found' });


//         const service = section.services.find(service => service._id.toString() === service_id);


//         if (!service) return res.status(404).json({ message: 'Service not found' });

//         res.status(200).json(service);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching service', error });
//     }
// };


// const delete_service = async (req, res) => {
//     try {
//         const { section_id, service_id } = req.params;

//         // Find the section by ID
//         const section = await Sections.findById(section_id);
//         if (!section) return res.status(404).json({ message: 'Section not found' });


//         const serviceIndex = section.services.findIndex(service => service._id.toString() === service_id);
//         if (serviceIndex === -1) return res.status(404).json({ message: 'Service not found' });


//         section.services.splice(serviceIndex, 1);

//         await section.save();

//         res.status(200).json({ message: 'Service deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting service', error });
//     }
// };


// const delete_all_services = async (req, res) => {
//     try {

//         const result = await Sections.updateMany({}, { $set: { services: [] } });

//         if (result.modifiedCount === 0) {
//             return res.status(404).json({ message: 'No services found to delete' });
//         }

//         res.status(200).json({ message: 'All services deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error deleting all services', error });
//     }
// };




// module.exports = {
//     dash_register,
//     dash_admin_Login,
//     add_section,
//     edit_section,
//     get_all_sections,
//     get_section,
//     get_service,
//     delete_service,
//     delete_all_services,



// };
