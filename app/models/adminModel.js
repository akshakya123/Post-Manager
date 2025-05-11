const { default: mongoose } = require("../startup/mongoStartup")

const adminSchema=new mongoose.Schema({
    name:{type:String},
    email:{type:String,reqiured:true},
    password:{type:String,required:true}
})

const adminModel=new mongoose.model('adminModel',adminSchema)

module.exports=adminModel