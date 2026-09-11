const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
       unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
      type:String,
      enum:["user","admin","supervisior"],
      default:"user"
    },
    otp:{
        type:String,
        default:null
    },
    otpExpiry:{
        type:String,
       default:null
    },
    resetotp:{
        type:String,
        default:null
    },
    resetotpExpriry:{
        type:String,
        default:null
    }
},{
    timestamps:true
})

const usermodel=mongoose.model("user",userSchema)

module.exports=usermodel