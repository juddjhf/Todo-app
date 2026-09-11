const todomodel=require("../model/Todo.model")


async function Createtodo(req, res) {
  try {
    const { task, description } = req.body;

    if (!task || !description) {
      return res.status(400).json({
        success: false,
        message: "Enter your task and description",
      });
    }

    const todo = await todomodel.create({
      task,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function gettodo(req,res){
    try{
        const todo=await todomodel.find()


        return res.status(201).json({
            success:true,
            message:"Get Successfully",
            data:todo
        })
    }catch(error){
        return res.status(500).json({
            succcess:false,
            message:error.message
        })
    }
}

async function updatetodo(req,res){
    try{
  const {task,description}=req.body
  const {id}=req.params

  const todo=await todomodel.findByIdAndUpdate(
    id,{
        task,
        description
    },
    {
        new:true
    }
  )


  if(!todo){
    return res.status(400).json({
        sucess:false,
        message:"Todo not found"
    })
  }


  return res.status(201).json({
    success:true,
    message:"update successfully",
    data:todo
  })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


async function deletetodo(req,res){
    try{
    const {id}=req.params
    const todo=await todomodel.findByIdAndDelete(id)

    if(!todo){
        return res.status(400).json({
            success:false,
            message:"Todo not found"
        })
    }

    return res.status(200).json({
        success:true,
        message:"Todo deleted Successfully"
    })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

module.exports={Createtodo,gettodo,deletetodo,updatetodo}