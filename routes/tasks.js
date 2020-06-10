const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/TasksController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//crear tarea
//api/task
router.post(
  "/",
  auth,
  [
    check("name", "You must add a name")
      .not()
      .isEmpty(),
    check("name", "You must add a project")
      .not()
      .isEmpty()
  ],
  tasksController.createTask
);

//obtener tareas por proyecto
router.get("/",
 auth, 
 tasksController.getTasks);

 //actualizar tares
 router.put('/:id',
 auth,
 tasksController.updateTask)

 router.delete('/:id',
 auth,
 tasksController.deleteTask)

module.exports = router;
