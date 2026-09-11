const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const todoController = require("../Controller/todoController");

const router = express.Router();

router.post("/", authMiddleware, todoController.Createtodo);

router.get("/", authMiddleware, todoController.gettodo);

router.put("/:id", authMiddleware, todoController.updatetodo);

router.delete("/:id", authMiddleware, todoController.deletetodo);

module.exports = router;