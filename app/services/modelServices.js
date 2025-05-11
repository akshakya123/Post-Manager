const { mongo } = require("../startup/mongoStartup")

let modelServices={}

modelServices.find=async(model,data,options)=>{
    return await model.find(data,options)
}

modelServices.findOneAndUpdate=async(model,data,update,option)=>{
    return await model.findOneAndUpdate(data,update,option)
}

modelServices.insertOne=async(model,data)=>{
    return await model.insertOne(data)
}

modelServices.aggregate=async(model,data)=>{
    return await model.aggregate(data)
}

modelServices.findOne=async(model,data,options)=>{
    return await model.findOne(data,options)
}

modelServices.findOneAndDelete=async(model,data)=>{
    return await model.findOneAndDelete(data)
}

module.exports=modelServices;