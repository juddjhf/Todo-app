require("dotenv").config()
const app=require("./src/app")
const Connectdb=require("./src/Config/db")

Connectdb()


app.listen(3000,()=>{
    console.log("Server is running on the port")
})