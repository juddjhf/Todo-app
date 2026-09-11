const mongoose=require("mongoose")

const todoSchema=new mongoose.Schema({
    task:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const todomodel=mongoose.model("todo",todoSchema)

module.exports=todomodel