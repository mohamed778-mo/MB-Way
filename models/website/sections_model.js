// const mongoose = require('mongoose');

// const sectionSchema=new mongoose.Schema({
//     name: String,
//     main_title: String,
//     subsidiary_title:String,
//     description: String,
//     photo:String,

//     services:[{
//         name:String,
//         description:String,
//         questions_Answers:[{
//             question:String,
//             answer:String,
//         }],
//         photos:[{
//             photo:String,
//         }],
//         employees:[{
//            employee_id: {
//                type: mongoose.Schema.Types.ObjectId,
//                ref: 'Employee'
//            },
//             employee_name:[{
//                 type:String,
//             }],
//             employee_job:{
//                type:String,
//             },
//             employee_availavle_time:[{
//                type:Date,
//             }]

//         }],
//         type:{
//             type:String,
//             enum:['free','paid']
//         },
//         price:{
//             type:Number,
//         }

//     }],

//     facebook_number:{
//         type:Number,
//         default:0
//     },
//     instagram_number:{
//         type:Number,
//         default:0
//     },
//     linkedin_number:{
//         type:Number,
//         default:0
//     },
//     twitter_number:{
//         type:Number,
//         default:0
//     },
//     youtube_number:{
//         type:Number,
//         default:0
//     },
//     tiktok_number:{
//         type:Number,
//         default:0
//     }

// })

// module.exports=mongoose.model('Sections', sectionSchema);
