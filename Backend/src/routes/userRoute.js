const express=require("express")
const userController=require("../Controller/userController")

const router=express.Router()


router.post("/create",userController.Register)
router.post("/login",userController.login)
router.post("/refreshtoken",userController.refreshtoken)


module.exports=router