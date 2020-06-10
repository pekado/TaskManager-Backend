const Task = require("../models/Task");
const Project = require("../models/Projects");
const { validationResult } = require("express-validator");

//crea una tarea
exports.createTask = async (req, res) => {
  //revisar si hay errores
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  //extraer el proyecto y comprobar si existe
  const { project } = req.body;
  try {
    const currentProject = await Project.findById(project);
    if (!currentProject) {
      res.status(404).json({ msg: "project not found" });
    }
    //revisar si el proyecto es del usuario
    if (currentProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "no authorization" });
    }
    //creamos tara
    const task = new Task(req.body);
    await task.save();
    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "server error" });
  }
};
//obtiene tareas por proyectos
exports.getTasks = async (req, res) => {
  //extraemos el proyecto
  try {
    const { project } = req.query;
    const currentProject = await Project.findById(project);
    if (!currentProject) {
      res.status(404).json({ msg: "project not found" });
    }
    //revisar si el proyecto es del usuario
    if (currentProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "no authorization" });
    }
    // obtener tareas por proyectos
    const tasks = await Task.find({ project }).sort({ creator: -1 });
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).send("sever error");
  }
};
//actualiza tareas
exports.updateTask = async (req, res) => {
  try {
    const { project, name, state } = req.body;
    //si la tarea existe
    let currentTask = await Task.findById(req.params.id);
    if (!currentTask) {
      return res.status(404).json({ msg: "task doesn´t exist" });
    }
    const currentProject = await Project.findById(project);
    //revisar si el proyecto es del usuario
    if (currentProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "no authorization" });
    }
    //crear objeto con nueva info
    const newTask = {};
    newTask.name = name;
    newTask.state = state;
    //guardar tarea
    currentTask = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true
    });
    res.json({ currentTask });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};

//elimina tarea
exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query;
    //si la tarea existe

    let currentTask = await Task.findById(req.params.id);
    if (!currentTask) {
      return res.status(404).json({ msg: "task doesn´t exist" });
    }
    const currentProject = await Project.findById(project);

    //revisar si el proyecto es del usuario
    if (currentProject.creator.toString() !== req.user.id) {
      return res.status(401).json({ msg: "no authorization" });
    }
    //eliminar
    await Task.findByIdAndRemove({ _id: req.params.id });
    res.json({ msg: "deleted task" });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};
