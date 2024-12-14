const mongoose = require('mongoose')
const validator=require('validator')
const bcryptjs = require('bcryptjs')


var employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
      
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(valu){
            if(!validator.isEmail(valu)){
                throw new Error("Invalid email")
            }
        }
    },
    verified:{
        type:Boolean,
        default:false
      },
    national_id:{
        type:String,
      },
    phone:{
        type:String,
        trim:true,
    },
    BirthOD:{
        type:String,
    },
    duration:{
        type:Number,
        default:0
    },
    func_spec:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
        validate(value){
            const StrongPassword = new RegExp("^(?=.*[a-z])(?=.*[0-9])")
            if(!StrongPassword.test(value)){
              throw new Error(" Password must contain ' ^(?=.*[a-z])(?=.*[0-9]) ' ")
            }
          }
    },
    tokens:[
        {
            type:String,
            expires:"30d"
        }
    ],
    isManager:{
        type:Boolean,
        default:false
    },
    isBlock:{
        type:Boolean,
        default:false
    },

    role:{
        type:String,
        default:'Employee'
    },
    photo:{
        type:String,
        default:null
    },
    salary:{
        type:Number,
        default:0
    },
    section:{
        type:String,
        enum:[
            'medical','tourism','engineering',
            'education','trade_commerce','real_estate','graphics','financial'
        ]
    },
    job:{
        type:String,
    },
     from:{
        type:String,
        },
    to:{
        type:String,
        },
    task_notdone:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task'
    }],
    task_done:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Task'
    }],
    meeting:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Meeting'
    }],
    passwordChangedAt: {
        type:Date
    },
    passwordResetToken: {
        type:String
    },
    passwordResetExpires: {
        type:Date
    },

}
,
{
 timestamps:true
}
);

employeeSchema.pre("save",async function(){

    try {
     const user = this 
        if(!user.isModified("password")){
        
          return
        }
            user.password = await bcryptjs.hash( user.password , 8)
      
      }
   catch (error) {
        console.log(error)
  } 
     })     
    
     employeeSchema.methods.toJSON = function(){
        const user = this 
        const dataToObject = user.toObject()
        delete dataToObject.password
        delete dataToObject.tokens
       
        return dataToObject
      }
      



module.exports = mongoose.model('Employee', employeeSchema);
