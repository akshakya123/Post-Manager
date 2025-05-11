const { required } = require('joi');
const { default: mongoose } = require("../startup/mongoStartup");

const userSchema=new mongoose.Schema({
    name:{type:String},
    gender:{type:String},
    email:{type:String,required:true},
    password:{type:String},
    otp:{type:String},
    isVerified:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false}
},{timestamps:true})

const userModel=new mongoose.model('userModel',userSchema)

module.exports=userModel