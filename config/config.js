const mongoose =require("mongoose")
require("dotenv").config()
const URL =process.env.MONGODB_URL
const connection = ()=>{
   mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{console.log('done connection !!')})
  .catch((error)=>{console.log(error.message)})
}

module.exports = connection

 
