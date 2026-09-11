const express=require("express")
const cookieparser=require("cookie-parser")
const userRoutes=require("./routes/userRoute")
const todoroutes=require("./routes/TodoRoute")
const cors=require("cors")

const app=express()
app.use(express.json())
app.use(cookieparser())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use("/api/user",userRoutes)
app.use("/api/todo",todoroutes)


module.exports=app